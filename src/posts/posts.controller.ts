import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UploadedFile, UseInterceptors, Req, Put, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Import diskStorage from multer
import { diskStorage } from 'multer';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { posts } from '@prisma/client';
import * as path from 'path'; // Import path for file handling
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import * as fs from 'fs';

@ApiTags('Posts')
@Controller('posts')
// @UseGuards(RolesGuard, JwtAuthGuard, PermissionsGuard)
// @ApiBearerAuth('jwt')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Permissions('create-post')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('img', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const originalName = file.originalname.split('.')[0];
        const fileExt = path.extname(file.originalname);
        const newFileName = `${originalName}-${Date.now()}${fileExt}`;
        cb(null, newFileName);
      },
    }),
  }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createGalleryDto: any
  ) {
    // Construct the file URL if an image was uploaded
    const fileUrl = file ? `/${file.filename}` : null;
  
    // Prepare the final DTO for creating a gallery
    const updatedGalleryDto = {
      ...createGalleryDto,
      img: fileUrl, // Attach the image URL directly at the root level
    };
  
    return await this.postsService.create(updatedGalleryDto);
  }  


  @Get()
  @Permissions('view-post')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No posts found.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of posts to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  @Roles('super-admin', 'admin')
  async findAll(
    @Req() req,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ): Promise<PostResponseDto> {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.postsService.findAll(limitNumber, pageNumber);
  }

  @Get(':id')
  @Permissions('view-post')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', required: true })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async findOne(@Param('id') id: string): Promise<posts | null> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @Permissions('update-post')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', required: true })
  @ApiResponse({ status: 200, description: 'Post successfully updated.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @UseInterceptors(FileInterceptor('img', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const originalName = file.originalname.split('.')[0];
        const fileExt = path.extname(file.originalname);
        const newFileName = `${originalName}-${Date.now()}${fileExt}`;
        cb(null, newFileName);
      },
    }),
  }))
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // Delete old image if new image is uploaded
    if (file && post.img) {
      const oldImagePath = `./uploads${post.img}`;
      try {
        fs.unlinkSync(oldImagePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    // Remove image if img is set to null
    if (updatePostDto.img === null && post.img) {
      const oldImagePath = `./uploads${post.img}`;
      try {
        fs.unlinkSync(oldImagePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
      post.img = null;
    }

    const updatedPostDto = {
      ...updatePostDto,
      img: file ? `/${file.filename}` : post.img,
    };

    return this.postsService.update(id, updatedPostDto);
  }

  @Delete(':id')
  @Permissions('delete-post')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', required: true })
  @ApiResponse({ status: 204, description: 'Post successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async remove(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.img) {
      const imagePath = `./uploads${post.img}`;
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await this.postsService.remove(id);
  }

  @Put('like/:id')
  async like(
    @Param('id') id: string,
  ) {
    return this.postsService.like(id);
  }

  @Put('dislike/:id')
  async dislike(
    @Param('id') id: string,
  ) {
    return this.postsService.dislike(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully.' })
  async addComment(@Param('id') postId: string, @Body('content') content: string) {
    return this.postsService.addComment(postId, content);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully.' })
  async getComments(@Param('id') postId: string) {
    return this.postsService.getComments(postId);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully.' })
  async deleteComment(@Param('id') commentId: string) {
    return this.postsService.deleteComment(commentId);
  }
}
