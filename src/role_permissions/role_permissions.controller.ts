import { Controller, Get, Post, Body, Patch, Param, Delete , Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RolePermissionsService } from './role_permissions.service';
import { CreateRolePermissionDto } from './dto/create-role_permission.dto';
import { UpdateRolePermissionDto } from './dto/update-role_permission.dto';

@Controller('role-permissions')
@ApiTags('Role Permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role-permission relationship' })
  @ApiResponse({ status: 201, description: 'The role-permission relationship has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all role-permission relationships with pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'List of all role-permission relationships.' })
  findAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    return this.rolePermissionsService.findAll(limit, page);
  }
  

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific role-permission relationship by ID' })
  @ApiResponse({ status: 200, description: 'The specific role-permission relationship.' })
  @ApiResponse({ status: 404, description: 'Role-permission relationship not found.' })
  findOne(@Param('id') id: string) {
    return this.rolePermissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specific role-permission relationship by ID' })
  @ApiResponse({ status: 200, description: 'The role-permission relationship has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Role-permission relationship not found.' })
  update(@Param('id') id: string, @Body() updateRolePermissionDto: UpdateRolePermissionDto) {
    return this.rolePermissionsService.update(id, updateRolePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific role-permission relationship by ID' })
  @ApiResponse({ status: 200, description: 'The role-permission relationship has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Role-permission relationship not found.' })
  remove(@Param('id') id: string) {
    return this.rolePermissionsService.remove(id);
  }
}
