import { Module } from '@nestjs/common';
import { UserRolesService } from './user_roles.service';
import { UserRolesController } from './user_roles.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [UserRolesController],
  providers: [UserRolesService,PrismaService ],
})
export class UserRolesModule {}
