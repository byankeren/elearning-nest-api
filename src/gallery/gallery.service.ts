import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGalleryDto: any) {
    const { user_id, name, desc, img, categories } = createGalleryDto;
    
    // Prepare the data for creating a new gallery entry
    const galleryData = {
      name,
      user_id,
      desc,
      img, // Image URL from the file upload
    };
  
    try {
      console.log(user_id);
  
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
  
        // Filter out any entries where category_id is undefined
        const validCategories = categoryConnections.filter((conn) => conn.category_id);
  
        await this.prisma.gallery_categories.createMany({
          data: validCategories,
        });
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
        include: {
          categories: true,
          user: true, 
        }
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

  async update(id: string, updateGalleryDto: any) {
    const { img, categories, ...otherData } = updateGalleryDto;
  
    // Log the other data to debug
    console.log(otherData);
  
    // Delete existing gallery-category relations
    await this.prisma.gallery_categories.deleteMany({
      where: {
        gallery_id: id,
      },
    });
  
    // If categories are provided, create new gallery-category relations
    if (categories && Array.isArray(categories)) {
      // Map over the categories and prepare the data
      const categoryConnections = categories.map((category) => {
        // Parse category string if necessary
        const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;
  
        return {
          gallery_id: id,
          category_id: parsedCategory.category_id, // Ensure category_id exists
        };
      });
  
      // Filter out any invalid categories
      const validCategories = categoryConnections.filter((conn) => conn.category_id);
  
      // Create new gallery-category relations in bulk
      await this.prisma.gallery_categories.createMany({
        data: validCategories,
      });
    }
  
    // Update the gallery with the new data
    const gallery = await this.prisma.galleries.update({
      where: { id },
      data: {
        name: otherData.name,
        desc: otherData.desc,
        img: img || undefined, // Only update the image if a new one is provided
      },
    });
  
    return gallery;
  }  
  

  async remove(id: string) {
    await this.findOne(id); // Ensure gallery exists
    await this.prisma.gallery_categories.deleteMany({
      where: {gallery_id: id}
    })
    return this.prisma.galleries.delete({
      where: { id },
    });
  }
}
