import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    return this.prisma.categories.create({ data });
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.categories.findMany({
        skip: skip,
        take: limit,
      }),
      this.prisma.categories.count()
    ]);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      }
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    await this.findOne(id); // Ensure category exists

    return this.prisma.categories.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure category exists

    return this.prisma.categories.delete({
      where: { id },
    });
  }
}
