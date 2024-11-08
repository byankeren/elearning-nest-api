import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGalleryDto: any) {
    const { name, desc, img, categories } = createGalleryDto;

    // Prepare the data for creating a new gallery entry
    const galleryData = {
      name,
      desc,
      img, // Image URL from the file upload
    };

    try {
      // Save the main gallery entry
      const gallery = await this.prisma.galleries.create({
        data: galleryData,
      });

      // Check if categories are provided and parse them
      if (categories && Array.isArray(categories)) {
        const categoryConnections = categories.map((category) => {
          // Parse JSON if necessary
          const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;

          return {
            gallery_id: gallery.id,
            category_id: parsedCategory.category_id, // Ensure category_id exists
          };
        });
        console.log("categoryConnections", categoryConnections)
        // Filter out any entries where category_id is undefined
        const validCategories = categoryConnections.filter((conn) => conn.category_id);
        console.log("validCategories", validCategories)

          const asd = await this.prisma.gallery_categories.createMany({
            data: validCategories,
          });
          console.log(asd)
      }

      return gallery;
    } catch (error) {
      throw new Error(`Failed to create gallery: ${error.message}`);
    }
  }
  
  

  async findAll(limit: number = 10, page: number = 1, category_id: string) {
    const skip = (page - 1) * limit;
    const where = {...(category_id ? {
      categories: {
        some: {
          category_id: category_id,
        },
      },
    } : {})}
    const [data, total] = await Promise.all([
      this.prisma.galleries.findMany({
        where,
        skip: skip,
        take: limit,
        include: {categories: true}
      }),
      this.prisma.galleries.count({where}),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const gallery = await this.prisma.galleries.findUnique({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found`);
    }

    return gallery;
  }

  async update(id: string, updateGalleryDto: UpdateGalleryDto) {
    await this.findOne(id); // Ensure gallery exists

    return this.prisma.galleries.update({
      where: { id },
      data: updateGalleryDto.data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure gallery exists

    return this.prisma.galleries.delete({
      where: { id },
    });
  }
}
