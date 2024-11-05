import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGalleryDto: CreateGalleryDto) {
    return this.prisma.galleries.create({ data: createGalleryDto});
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
      data: updateGalleryDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure gallery exists

    return this.prisma.galleries.delete({
      where: { id },
    });
  }
}
