import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { users } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';

@ApiTags('Users')
@Controller('users')
// @UseGuards(RolesGuard, JwtAuthGuard, PermissionsGuard)
// @ApiBearerAuth('jwt')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
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
  async create(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: any) {
    // Construct the file URL if an image was uploaded
    const fileUrl = file ? `/${file.filename}` : null;
    // Prepare the final DTO for creating a user
    const updatedUserDto = {
      ...createUserDto,
      image: fileUrl, // Attach the image URL directly at the root level
    };
    return this.usersService.create(updatedUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No users found.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of users to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  async findAll(@Query('limit') limit?: string, @Query('page') page?: string): Promise<UserResponseDto> {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.usersService.findAll(limitNumber, pageNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string): Promise<users | null> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
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
  async update(@Param('id') id: string, @Body() updateUserDto: any, @UploadedFile() file: Express.Multer.File) {
    // Construct the file URL if an image was uploaded
    const fileUrl = file ? `/${file.filename}` : null;
    // Prepare the final DTO for updating the user
    const { img, ...rest } = updateUserDto;
    const updatedUserDto = {
      ...rest,
      image: fileUrl, // Attach the image URL directly at the root level
    };
    return this.usersService.update(id, updatedUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 204, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string): Promise<users> {
    return this.usersService.remove(id);
  }

  @Delete(':id/photo')
  @ApiOperation({ summary: 'Delete user photo by ID' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 204, description: 'Photo successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found or photo does not exist.' })
  async removePhoto(@Param('id') id: string): Promise<void> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user || !user.image) {
        throw new NotFoundException('User not found or no photo to delete');
      }

      const imagePath = path.join(__dirname, '..', '..', 'uploads', path.basename(user.image));

      const result = await this.usersService.removeImage(imagePath);
      if (!result) {
        throw new BadRequestException('Failed to delete image');
      }

      await this.usersService.update(id, { image: null });

    } catch (error) {
      console.error('Error deleting photo:', error);
      throw new BadRequestException('Failed to delete image');
    }
  }
  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a user' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 201, description: 'Comment added successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async addComment(
    @Param('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.usersService.addComment(userId, content);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a user' })
  @ApiParam({ name: 'id', description: 'User ID', required: true })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getComments(@Param('id') userId: string) {
    return this.usersService.getComments(userId);
  }

  @Delete('comments/:id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID', required: true })
  @ApiResponse({ status: 204, description: 'Comment deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  async deleteComment(@Param('id') commentId: string) {
    return this.usersService.deleteComment(commentId);
  }
}
