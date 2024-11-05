import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'; // Import diskStorage from multer
import { diskStorage } from 'multer';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { galleries } from '@prisma/client';
import * as path from 'path'; // Import path for file handling

@ApiTags('Gallery')
@Controller('gallery')
// @UseGuards(AuthGuard('jwt')) // Uncomment if using JWT authentication
// @ApiBearerAuth('jwt') // Uncomment if using JWT authentication
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery' })
  @ApiResponse({ status: 201, description: 'Gallery successfully created.' })
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
    @Body() createGalleryDto: CreateGalleryDto
  ) {
    console.log(file);
    const fileUrl = file ? `/${file.filename}` : null;
    return await this.galleryService.create({
      ...createGalleryDto,
      img: fileUrl,
    });
  }  

  @Get()
  @ApiOperation({ summary: 'Get all galleries' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No galleries found.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of galleries to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  @ApiQuery({ name: 'category_id', required: false, description: 'Categories', example: 1 })
  async findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('category_id') category_id?: string
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
  async update(@Param('id') id: string, @Body() updateGalleryDto: UpdateGalleryDto): Promise<galleries> {
    return this.galleryService.update(id, updateGalleryDto);
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
