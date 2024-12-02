import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

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

    console.log(user_id)

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
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: any) {
    console.log(updatePostDto)
    let { user_id, title, desc, content, img, categories } = updatePostDto;
    const slug = title.toLowerCase().split(" ").join("-")
    // Prepare the data for creating a new gallery entry
    let postData = {
      title,
      slug,
      user_id,
      desc,
      img, // Image URL from the file upload
    };
  
    // Delete existing gallery-category relations
    await this.prisma.post_category.deleteMany({
      where: {
        post_id: id,
      },
    });
  
    // If categories are provided, create new gallery-category relations
    if (categories && Array.isArray(categories)) {
      // Map over the categories and prepare the data
      const categoryConnections = categories.map((category) => {
        // Parse category string if necessary
        const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;
  
        return {
          post_id: id,
          category_id: parsedCategory.category_id, // Ensure category_id exists
        };
      });
  
      // Filter out any invalid categories
      const validCategories = categoryConnections.filter((conn) => conn.category_id);
  
      // Create new gallery-category relations in bulk
      await this.prisma.post_category.createMany({
        data: validCategories,
      });
    }

    const existingPost = await this.prisma.posts.findFirst({
      where: { id }
    })
    if (!img) {
      img = existingPost.img
    }
    // Update the gallery with the new data
    const post = await this.prisma.posts.update({
      where: { id },
      data: {
        title: postData.title,
        slug: postData.slug,
        desc: postData.desc,
        img: img,
      },
    });
    await this.prisma.post_details.updateMany({
      where: { post_id: id },
      data: {
        content: content,
      },
    });
  
    return post;
  }

  async remove(id: string) {
    // Hapus data terkait di tabel `post_details`
    await this.prisma.post_details.deleteMany({
      where: { post_id: id },
    });
    await this.prisma.post_category.deleteMany({
      where: { post_id: id },
    });
  
    // Hapus data di tabel `posts`
    return await this.prisma.posts.delete({
      where: { id },
    });
  }
  
}
