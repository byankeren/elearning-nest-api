import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Put,  UploadedFile, UseInterceptors, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { users } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express'; // Import diskStorage from multer
import { diskStorage } from 'multer';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import * as path from 'path'; // Import path for file handling

@ApiTags('Users')
@Controller('users')
@UseGuards(RolesGuard, JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('jwt')
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
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createUserDto: any
  ){
        // Construct the file URL if an image was uploaded
        const fileUrl = file ? `/${file.filename}` : null;
  
        // Prepare the final DTO for creating a gallery
        const updatedUserDto = {
          ...createUserDto,
          image: fileUrl, // Attach the image URL directly at the root level
        };
    return this.usersService.create(updatedUserDto);
  }

  @Get()
  @Permissions('view-users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'No users found.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of users to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  async findAll(
    @Req() req,
    @Query('limit') limit?: string,
    @Query('page') page?: string
  ): Promise<UserResponseDto> {
    // const user = JSON.parse(req.headers['user'])
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
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Construct the file URL if an image was uploaded
    const fileUrl = file ? `/${file.filename}` : null
    // Prepare the final DTO for creating a gallery
    const {img, ...rest} = updateUserDto
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

  @Put('like/:id')
  async like(@Param('id') id: string) {
    return this.usersService.like(id);
  }
  @Put('dislike/:id')
  async dislike(@Param('id') id: string) {
    return this.usersService.dislike(id);
  }
}
