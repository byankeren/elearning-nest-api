import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  [x: string]: any;
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.prisma.users.create({data});
  }

  async findAll(limit: number = 10, page: number = 1) {
    // console.log(user)
    // let whereCondition;
    // if (user.role == 'admin') {
    //   whereCondition = { id: user.id }
    // }
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.users.findMany({
        skip: skip,
        take: limit,
        // where: whereCondition
      }),
      this.prisma.users.count({
        // where: whereCondition
      })
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
    const user = await this.prisma.users.findUnique({
      where: { email },
      include: { role: true }
    });
    console.log('user', user)
    return user
  }

  async update(id: string, data: any) {
    const user = await this.findOne(id)

    if(!data.image) {
      data.image = user.image
    }

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

  async deletePhoto(userId: string) {
    // Cari user berdasarkan ID
    const user = await this.findOne(userId);
  
    if (!user.image) {
      throw new NotFoundException(`User with ID ${userId} does not have a photo.`);
    }
  
    const fs = require('fs');
    fs.unlinkSync(user.image);
  
    // Reset data `image` di database menjadi null
    return this.prisma.users.update({
      where: { id: userId },
      data: { image: null },
    });
  }  

  async like(id: string) {
    const post = await this.prisma.users.findUnique({
      where: { id },
    });

    await this.prisma.users.update({
      where: {id},
      data: {likes: post.likes + 1}
    })

    return post;
  }

  async dislike(id: string) {
    const post = await this.prisma.users.findUnique({
      where: { id },
    });
    if (post.likes > 0) {
      await this.prisma.users.update({
        where: {id},
        data: {likes: post.likes - 1}
      })
    }

    return post;
  }

  async addComment(userId: string, content: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user_comments.create({
      data: {
        user_id: userId,
        content,
      },
    });
  }

  async getComments(userId: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user_comments.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async deleteComment(commentId: string) {
    const comment = await this.prisma.user_comments.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${commentId} not found`);
    }

    return this.prisma.user_comments.delete({
      where: { id: commentId },
    });
  }
}
