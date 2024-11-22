import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Import diskStorage from multer
import { diskStorage } from 'multer';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { posts } from '@prisma/client';
import * as path from 'path'; // Import path for file handling
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Posts')
@Controller('posts')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('jwt')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
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
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No posts found.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of posts to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  async findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string
  ): Promise<PostResponseDto> {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.postsService.findAll(limitNumber, pageNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', required: true })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async findOne(@Param('id') id: string): Promise<posts | null> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', required: true })
  @ApiResponse({ status: 200, description: 'Post successfully updated.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async update(@Param('id') id: string, @Body() updatePostDto: any) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID', required: true })
  @ApiResponse({ status: 204, description: 'Post successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
