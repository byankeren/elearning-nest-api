import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.users.create({data});
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.users.findMany({
        skip: skip,
        take: limit,
      }),
      this.prisma.users.count()
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
    const user = await this.prisma.users.findUnique({
      where: { id },
    });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    return user;
  }  

  async findOneByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id)

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.users.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string) {
    await this.findOne(id)

    return this.prisma.users.delete({
      where: { id }
    });
  }
}
