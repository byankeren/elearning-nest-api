import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { roles } from '@prisma/client';
import { permission } from 'process';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createRoleDto: CreateRoleDto): Promise<roles> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'Return a list of roles.' })
  @ApiResponse({ status: 404, description: 'No roles found.' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of users to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string
  ) {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.rolesService.findAll(limitNumber, pageNumber);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Return the role with the specified ID.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the role to retrieve' })
  findOne(@Param('id') id: string): Promise<roles | null> {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiResponse({ status: 200, description: 'The role has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the role to update' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto): Promise<roles> {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: 200, description: 'The role has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  @ApiParam({ name: 'id', description: 'The ID of the role to delete' })
  remove(@Param('id') id: string): Promise<roles> {
    return this.rolesService.remove(id);
  }

  @Post('add-permission/:id')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  addPermission(@Param('id') id: string, @Body() createRoleDto: any){
    return this.rolesService.addPermission(id, createRoleDto);
  }
}
