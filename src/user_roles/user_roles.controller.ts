import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { UserRolesService } from './user_roles.service';
import { CreateUserRoleDto } from './dto/create-user_role.dto';
import { UpdateUserRoleDto } from './dto/update-user_role.dto';

@ApiTags('UserRoles') // Using ApiTags to provide information in Swagger
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @ApiOperation({ summary: 'Create a new user role' })
  @ApiResponse({ status: 201, description: 'The user role has been successfully created.' })
  @Post()
  create(@Body() createUserRoleDto: CreateUserRoleDto) {
    return this.userRolesService.create(createUserRoleDto);
  }

  @ApiOperation({ summary: 'Get all user roles' })
  @ApiResponse({ status: 200, description: 'Returns all user roles' })
  @Get()
  findAll() {
    return this.userRolesService.findAll();
  }

  @ApiOperation({ summary: 'Get a user role by ID' })
  @ApiResponse({ status: 200, description: 'Returns a user role' })
  @ApiParam({ name: 'id', description: 'ID of the user role' })
  @Get(':id')
  findOne(@Param('id') id: string) {  // Ensure id is explicitly typed as string
    return this.userRolesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a user role by ID' })
  @ApiResponse({ status: 200, description: 'The user role has been successfully updated.' })
  @ApiParam({ name: 'id', description: 'ID of the user role to be updated' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {  // Ensure id is explicitly typed as string
    return this.userRolesService.update(id, updateUserRoleDto);
  }

  @ApiOperation({ summary: 'Delete a user role by ID' })
  @ApiResponse({ status: 200, description: 'The user role has been successfully deleted.' })
  @ApiParam({ name: 'id', description: 'ID of the user role to be deleted' })
  @Delete(':id')
  remove(@Param('id') id: string) {  // Ensure id is explicitly typed as string
    return this.userRolesService.remove(id);
  }
}
