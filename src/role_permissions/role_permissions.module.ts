import { Module } from '@nestjs/common';
import { RolePermissionsService } from './role_permissions.service';
import { RolePermissionsController } from './role_permissions.controller';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService, PrismaService],
})
export class RolePermissionsModule {}
