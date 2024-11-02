import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { galleries } from '@prisma/client';

@ApiTags('Gallery')
@Controller('gallery')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('jwt')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new gallery' })
  @ApiResponse({ status: 201, description: 'Gallery successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createGalleryDto: CreateGalleryDto): Promise<galleries> {
    return this.galleryService.create(createGalleryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all galleries' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No galleries found.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of galleries to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  async findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string
  ): Promise<{ data: galleries[]; meta: { total: number; page: number; limit: number; total_pages: number } }> {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.galleryService.findAll(limitNumber, pageNumber);
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
