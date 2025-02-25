import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  Req,
  Put,
  BadRequestException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Import diskStorage from multer
import { diskStorage } from 'multer';
import { GalleryService } from './gallery.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { galleries } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import * as path from 'path'; // Import path for file handling
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import * as fs from 'fs';
@ApiTags('Gallery')
@Controller('gallery')
// @UseGuards(RolesGuard, JwtAuthGuard, PermissionsGuard)
// @ApiBearerAuth('jwt')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery' })
  @ApiResponse({ status: 201, description: 'Gallery successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const originalName = file.originalname.split('.')[0];
          const fileExt = path.extname(file.originalname);
          const newFileName = `${originalName}-${Date.now()}${fileExt}`;
          cb(null, newFileName);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGalleryDto: any,
  ) {
    // Construct the file URL if an image was uploaded
    const fileUrl = file ? `/${file.filename}` : null;

    // Prepare the final DTO for creating a gallery
    const updatedGalleryDto = {
      ...createGalleryDto,
      img: fileUrl, // Attach the image URL directly at the root level
    };

    return await this.galleryService.create(updatedGalleryDto);
  }

  @Get()
  @Permissions('view-gallery')
  @ApiOperation({ summary: 'Get all galleries' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No galleries found.' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of galleries to return per page',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number to retrieve',
    example: 1,
  })
  @ApiQuery({
    name: 'category_id',
    required: false,
    description: 'Categories',
    example: 1,
  })
  async findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('category_id') category_id?: string,
  ) {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.galleryService.findAll(limitNumber, pageNumber, category_id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a gallery by ID' })
  @ApiParam({ name: 'id', description: 'Gallery ID', required: true })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  async findOne(@Param('id') id: string): Promise<galleries | null> {
    return this.galleryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a gallery by ID' })
  @ApiParam({ name: 'id', description: 'Gallery ID', required: true })
  @ApiResponse({ status: 200, description: 'Gallery successfully updated.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const originalName = file.originalname.split('.')[0];
          const fileExt = path.extname(file.originalname);
          const newFileName = `${originalName}-${Date.now()}${fileExt}`;
          cb(null, newFileName);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateGalleryDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const gallery = await this.galleryService.findOne(id);
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found`);
    }

    // Menghapus gambar lama jika ada dan tidak ada gambar baru yang diupload
    if (!file && gallery.img) {
      const imagePath = `./uploads${gallery.img}`;
      try {
        fs.unlinkSync(imagePath); // Menghapus gambar lama dari penyimpanan
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    // Menyusun DTO pembaruan dengan gambar baru jika ada
    const updatedGalleryDto = {
      ...updateGalleryDto,
      img: file ? `/${file.filename}` : gallery.img, // Jika gambar baru diupload, update gambar
    };

    return this.galleryService.update(id, updatedGalleryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery by ID' })
  @ApiParam({ name: 'id', description: 'Gallery ID', required: true })
  @ApiResponse({ status: 204, description: 'Gallery successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    const gallery = await this.galleryService.findOne(id);
    
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found`);
    }

    // Menghapus gambar jika ada
    if (gallery.img) {
      // Hapus gambar dari penyimpanan
      const imagePath = `./uploads${gallery.img}`;
      try {
        fs.unlinkSync(imagePath); // Menghapus file gambar
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    // Menghapus galeri dari database
    await this.galleryService.remove(id);
  }

  @Put('like/:id')
  async like(
    @Param('id') id: string,
  ) {
    return this.galleryService.like(id);
  }

  @Put('dislike/:id')
  async dislike(
    @Param('id') id: string,
  ) {
    return this.galleryService.dislike(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a gallery' })
  @ApiParam({ name: 'id', description: 'Gallery ID', required: true })
  async addComment(
    @Param('id') id: string,
    @Body('content') content: string,
  ) {
    if (!content || content.trim() === '') {
      throw new BadRequestException('Content cannot be empty');
    }

    return this.galleryService.addComment(id, content);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a gallery' })
  @ApiParam({ name: 'id', description: 'Gallery ID', required: true })
  async getComments(@Param('id') id: string) {
    return this.galleryService.getComments(id);
  }

  @Delete(':galleryId/comments/:commentId')
  @ApiOperation({ summary: 'Delete a comment from a gallery' })
  @ApiParam({ name: 'galleryId', description: 'Gallery ID', required: true })
  @ApiParam({ name: 'commentId', description: 'Comment ID', required: true })
  @ApiResponse({ status: 200, description: 'Comment successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async deleteComment(
    @Param('galleryId') galleryId: string,
    @Param('commentId') commentId: string,
  ) {
    await this.galleryService.deleteComment(galleryId, commentId);
    return { message: 'Comment deleted successfully.' };
  }
}
