import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust the import based on your folder structure
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRoleDto) {
    const role = await this.prisma.roles.create({
      data: {
        slug: data.name.toLocaleLowerCase(),
        ...data
      },
    });
    return role;
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.roles.findMany({
        skip: skip,
        take: limit,
      }),
      this.prisma.roles.count()
    ])
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
    const role = await this.prisma.roles.findUnique({
      where: { id },
    });
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: string, data: UpdateRoleDto) {
    await this.findOne(id)

    return await this.prisma.roles.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id)

    return await this.prisma.roles.delete({
      where: { id },
    });
  }
}
