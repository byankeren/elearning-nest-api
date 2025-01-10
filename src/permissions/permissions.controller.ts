import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Permissions')
@Controller('permissions')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('jwt')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @Roles('super-admin')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @Roles('super-admin')
  @ApiQuery({ name: 'limit', required: false, description: 'Number of posts to return per page', example: 10 })
  @ApiQuery({ name: 'page', required: false, description: 'Page number to retrieve', example: 1 })
  findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 1;
    return this.permissionsService.findAll(limitNumber, pageNumber);
  }

  @Get(':id')
  @Roles('super-admin')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @Roles('super-admin')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @Roles('super-admin')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(id);
  }
}
