import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';  // Pastikan Anda sudah memiliki PrismaService
// import { CreateUserRoleDto } from './dto/create-user_roles.dto';
// import { UpdateUserRoleDto } from './dto/update-user_roles.dto';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';

@Injectable()
export class UserRolesService {
  constructor(private prisma: PrismaService) {}

  // Menambahkan userRole baru
  async create(createUserRoleDto: CreateUserRoleDto) {
    const { user_id, roles_id } = createUserRoleDto;

    // Menambahkan entri baru di tabel user_roless
    return await this.prisma.user_roles.create({
      data: {
        user_id,
        roles_id,
      },
    });
  }

  // Mengambil semua user_roles
  async findAll() {
    return await this.prisma.user_roles.findMany();
  }

  // Mengambil satu userRole berdasarkan ID
  async findOne(id: string) {
    return await this.prisma.user_roles.findUnique({
      where: { id },
    });
  }

  // Mengupdate userRole dengan user_id dan roles_id
  async update(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    const { user_id, roles_id } = updateUserRoleDto;

    // Update userRole yang ada berdasarkan ID
    return await this.prisma.user_roles.update({
      where: { id },
      data: {
        user_id,
        roles_id,
      },
    });
  }

  // Menghapus userRole berdasarkan ID
  async remove(id: string) {
    return await this.prisma.user_roles.delete({
      where: { id },
    });
  }
}
