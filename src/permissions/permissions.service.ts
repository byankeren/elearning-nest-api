import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePermissionDto) {
    data.slug = data.name.toLocaleLowerCase().split(' ').join('-')
    return this.prisma.permissions.create({ data });
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.permissions.findMany({
        skip: skip,
        take: limit,
      }),
      this.prisma.permissions.count()
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
    const permission = await this.prisma.permissions.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new NotFoundException(`permission with ID ${id} not found`);
    }

    return permission;
  }

  async update(id: string, data: UpdatePermissionDto) {
    await this.findOne(id);

    return this.prisma.permissions.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.permissions.delete({
      where: { id },
    });
  }
}
