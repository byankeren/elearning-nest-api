import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Sesuaikan dengan struktur folder Anda
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role_permission.dto';

@Injectable()
export class RolePermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    const { role_id, permission_id } = createRolePermissionDto;
    return await this.prisma.role_permissions.create({
      data: {
        role_id,
        permission_id,
      },
    });
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.prisma.role_permissions.findMany({
        skip: skip,
        take: limit,
        where: {
          deleted_at: null, // Memastikan hanya data yang belum dihapus yang diambil
        },
        include: {
          role: true,
          permission: true,
        },
      }),
      this.prisma.role_permissions.count({
        where: {
          deleted_at: null, // Menghitung hanya data yang belum dihapus
        },
      }),
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
    return await this.prisma.role_permissions.findUnique({
      where: { id },
      include: {
        role: true,
        permission: true,
      },
    });
  }

  async update(id: string, updateRolePermissionDto: UpdateRolePermissionDto) {
    return await this.prisma.role_permissions.update({
      where: { id },
      data: {
        ...updateRolePermissionDto,
        updated_at: new Date(),
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.role_permissions.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
