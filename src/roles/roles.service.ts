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
        slug: data.name.toLocaleLowerCase().split(' ').join('-'),
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
        include: {permissions: true}
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
      data: {
        slug: data.name.toLocaleLowerCase().split(' ').join('-'),
        ...data
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id)

    return await this.prisma.roles.delete({
      where: { id },
    });
  }

  async addPermission(roleId: string, data: any) {
    console.log("Deleting existing permissions for role ID:", roleId);
  
    try {
      // Delete existing permissions for the role
      await this.prisma.role_permissions.deleteMany({
        where: { role_id: roleId },
      });
  
      // Handle nested or flat structure in `data`
      let newPermissions = [];
  
      // Check if the frontend sends nested `permissions.roles` or a flat array
      if (data.permissions?.roles) {
        newPermissions = data.permissions.roles.map((permissionId: string) => ({
          role_id: roleId,
          permission_id: permissionId,
        }));
      } else if (Array.isArray(data.permissions)) {
        newPermissions = data.permissions.map((permission: { permission_id: string }) => ({
          role_id: roleId,
          permission_id: permission.permission_id,
        }));
      } else {
        throw new Error("Invalid permissions format received");
      }
  
      console.log("Adding new permissions:", newPermissions);
  
      // Add the new permissions to the database
      await this.prisma.role_permissions.createMany({
        data: newPermissions,
      });
  
      console.log("Permissions updated successfully");
    } catch (error) {
      console.error("Error updating permissions:", error);
      throw new Error("Failed to update permissions");
    }
  }
  
}
