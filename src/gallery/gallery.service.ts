import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class GalleryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGalleryDto: any) {
    const { user_id, name, desc, img, categories } = createGalleryDto;
    
    // Prepare the data for creating a new gallery entry
    const galleryData = {
      name,
      user_id,
      desc,
      img, // Image URL from the file upload
    };
  
    try {
      console.log(user_id);
  
      // Save the main gallery entry
      const gallery = await this.prisma.galleries.create({
        data: galleryData,
      });
  
      // Check if categories are provided and parse them
      if (categories && Array.isArray(categories)) {
        const categoryConnections = categories.map((category) => {
          // Parse JSON if necessary
          const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;
  
          return {
            gallery_id: gallery.id,
            category_id: parsedCategory.category_id, // Ensure category_id exists
          };
        });
  
        // Filter out any entries where category_id is undefined
        const validCategories = categoryConnections.filter((conn) => conn.category_id);
  
        await this.prisma.gallery_categories.createMany({
          data: validCategories,
        });
      }
  
      return gallery;
    } catch (error) {
      throw new Error(`Failed to create gallery: ${error.message}`);
    }
  }
  
  async findAll(limit: number = 10, page: number = 1, category_id: string) {
    const skip = (page - 1) * limit;
    const where = {...(category_id ? {
      categories: {
        some: {
          category_id: category_id,
        },
      },
    } : {})}
    const [data, total] = await Promise.all([
      this.prisma.galleries.findMany({
        where,
        skip: skip,
        take: limit,
        include: {
          categories: true,
          user: true, 
        }
      }),
      this.prisma.galleries.count({where}),
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
    const gallery = await this.prisma.galleries.findUnique({
      where: { id },
    });

    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found`);
    }

    return gallery;
  }

  async remove(id: string): Promise<void> {
    const gallery = await this.prisma.galleries.findUnique({
      where: { id },
    });
  
    if (!gallery) {
      throw new NotFoundException('Gallery not found');
    }
  
    // Pastikan ada file gambar dan lakukan penghapusan file
    if (gallery.img) {
      const filePath = path.join(__dirname, '..', '..', 'uploads', gallery.img.replace('/', ''));
  
      // Hapus file gambar dari server
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting image:', err);
        } else {
          console.log('Image deleted successfully');
        }
      });
    }
  
    // Hapus gallery dan data terkait
    await this.prisma.gallery_categories.deleteMany({
      where: { gallery_id: id },
    });
  
    await this.prisma.galleries.delete({
      where: { id },
    });
  }

  async update(id: string, updateGalleryDto: any) {
    const { img, categories, ...otherData } = updateGalleryDto;
  
    // Menghapus gambar lama jika tidak ada gambar baru yang diupload
    const gallery = await this.prisma.galleries.findUnique({ where: { id } });
    if (gallery && img === null && gallery.img) {
      // Hapus gambar dari penyimpanan jika gambar dihapus
      const imagePath = `./uploads${gallery.img}`;
      try {
        fs.unlinkSync(imagePath); // Menghapus gambar lama dari server
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
  
    // Update galeri dengan data baru
    const updatedGallery = await this.prisma.galleries.update({
      where: { id },
      data: {
        ...otherData,
        img: img || undefined, // Update gambar jika ada gambar baru
      },
    });
  
    return updatedGallery;
  }  

  async like(id: string) {
    console.log(id)
    const post = await this.prisma.galleries.findUnique({
      where: { id },
    });

    await this.prisma.galleries.update({
      where: {id},
      data: {likes: post.likes + 1}
    })

    return post;
  }

  async dislike(id: string) {
    const post = await this.prisma.galleries.findUnique({
      where: { id },
    });

    if (post.likes > 0) {
      await this.prisma.galleries.update({
        where: {id},
        data: {likes: post.likes - 1}
      })
    }

    return post;
  }
  async addComment(gallery_id: string, content: string) {
    await this.findOne(gallery_id); // Pastikan galeri ada
  
    const comment = await this.prisma.comments.create({
      data: {
        gallery_id,
        content,
      },
    });
  
    return comment;
  }
  
  async getComments(gallery_id: string) {
    return this.prisma.comments.findMany({
      where: { gallery_id },
      orderBy: { created_at: 'desc' },
    });
  }
  
  async deleteComment(galleryId: string, commentId: string) {
    // Periksa apakah komentar ada dan terkait dengan galeri yang benar
    const comment = await this.prisma.comments.findUnique({
      where: { id: commentId },
    });
  
    if (!comment || comment.gallery_id !== galleryId) {
      throw new NotFoundException('Comment not found or does not belong to this gallery');
    }
  
    // Hapus komentar
    await this.prisma.comments.delete({
      where: { id: commentId },
    });
  }  
}
