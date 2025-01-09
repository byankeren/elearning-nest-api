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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import * as path from 'path'; // Import path for file handling
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@ApiTags('Gallery')
@Controller('gallery')
@UseGuards(RolesGuard, JwtAuthGuard) // Uncomment if using JWT authentication
@ApiBearerAuth('jwt') // Uncomment if using JWT authentication
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
  @Roles('super-admin')
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
    // ): Promise<{ data: galleries[]; meta: { total: number; page: number; limit: number; total_pages: number } }> {
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
    // Construct the file URL if a new image was uploaded
    const fileUrl = file ? `/${file.filename}` : null;

    // Prepare the updated gallery DTO
    const updatedGalleryDto = {
      ...updateGalleryDto,
      img: fileUrl, // Attach the new image URL if available, otherwise keep the old one
    };

    // Ensure gallery exists before updating
    const gallery = await this.galleryService.findOne(id);
    if (!gallery) {
      throw new NotFoundException(`Gallery with ID ${id} not found`);
    }

    return this.galleryService.update(id, updatedGalleryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a gallery by ID' })
  @ApiParam({ name: 'id', description: 'Gallery ID', required: true })
  @ApiResponse({ status: 204, description: 'Gallery successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Gallery not found.' })
  async remove(@Param('id') id: string): Promise<galleries> {
    return this.galleryService.remove(id);
  }
}
