import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: any) {
    const { user_id, title, desc, content, img, categories } = createPostDto;
    const slug = title.toLowerCase().split(" ").join("-")
    // Prepare the data for creating a new gallery entry
    const postData = {
      title,
      slug,
      user_id,
      desc,
      img, // Image URL from the file upload
    };

    try {
      // Save the main gallery entry
      const post = await this.prisma.posts.create({
        data: postData,
      });

      const detail = await this.prisma.post_details.create({
        data: {
          content,
          post_id: post.id
        }
      })

      // user_id

      // Check if categories are provided and parse them
      if (categories && Array.isArray(categories)) {
        const categoryConnections = categories.map((category) => {
          // Parse JSON if necessary
          const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;

          return {
            post_id: post.id,
            category_id: parsedCategory.category_id, // Ensure category_id exists
          };
        });
        console.log("categoryConnections", categoryConnections)
        // Filter out any entries where category_id is undefined
        const validCategories = categoryConnections.filter((conn) => conn.category_id);
        console.log("validCategories", validCategories)

          const asd = await this.prisma.post_category.createMany({
            data: validCategories,
          });
          console.log(asd)
      }

      return post;
    } catch (error) {
      throw new Error(`Failed to create gallery: ${error.message}`);
    }
  }

  async findAll(limit: number = 10, page: number = 1) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.posts.findMany({
        skip: skip,
        take: limit,
        include: {
          user: true, 
          images: true, 
          categories: true,
          post_details: true,
        },
      }),
      this.prisma.posts.count(),
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
    const post = await this.prisma.posts.findUnique({
      where: { id },
      include: {
        user: true,
        images: true,
        categories: true,
        post_details: true, 
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: any) {
    const { title, desc, content, img, categories } = updatePostDto;
    const slug = title ? title.toLowerCase().split(' ').join('-') : undefined;

    const existingPost = await this.findOne(id);

    if (!existingPost) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (categories && Array.isArray(categories)) {
      await this.prisma.post_category.deleteMany({
        where: { post_id: id },
      });

      const categoryConnections = categories.map((category) => {
        const parsedCategory =
          typeof category === 'string' ? JSON.parse(category) : category;
        return {
          post_id: id,
          category_id: parsedCategory.category_id,
        };
      });

      const validCategories = categoryConnections.filter(
        (conn) => conn.category_id,
      );

      await this.prisma.post_category.createMany({
        data: validCategories,
      });
    }

    const updatedPost = await this.prisma.posts.update({
      where: { id },
      data: {
        title,
        slug,
        desc,
        img,
      },
    });

    if (content) {
      await this.prisma.post_details.updateMany({
        where: { post_id: id },
        data: { content },
      });
    }

    return updatedPost;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.post_details.deleteMany({
      where: { post_id: id },
    });

    await this.prisma.post_category.deleteMany({
      where: { post_id: id },
    });

    return await this.prisma.posts.delete({
      where: { id },
    });
  }

  async like(id: string) {
    const post = await this.prisma.posts.findUnique({
      where: { id },
    });

    await this.prisma.posts.update({
      where: {id},
      data: {likes: post.likes + 1}
    })

    return post;
  }

  async dislike(id: string) {
    const post = await this.prisma.posts.findUnique({
      where: { id },
    });

    if (post.likes > 0) {
      await this.prisma.posts.update({
        where: {id},
        data: {likes: post.likes - 1}
      })
    }

    return post;
  }

  async addComment(postId: string, content: string) {
    return await this.prisma.comments_posts.create({
      data: {
        post_id: postId,
        content,
      },
    });
  }
  
  async getComments(postId: string) {
    return await this.prisma.comments_posts.findMany({
      where: { post_id: postId },
      orderBy: { created_at: 'desc' },
    });
  }
  
  async updateComment(commentId: string, content: string) {
    return await this.prisma.comments_posts.update({
      where: { id: commentId },
      data: { content },
    });
  }
  
  async deleteComment(commentId: string) {
    return await this.prisma.comments_posts.delete({
      where: { id: commentId },
    });
  }  
}
