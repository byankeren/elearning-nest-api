import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';
import { GalleryModule } from './gallery/gallery.module';
import { CategoriesModule } from './categories/categories.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ContactUsModule } from './contact-us/contact-us.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guards';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
// import { UserRolesModule } from './user_roles/user_roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolePermissionsModule } from './role_permissions/role_permissions.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RolesModule,
    PostsModule,
    GalleryModule,
    CategoriesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
    }),
    ContactUsModule,
    DashboardModule,
    PermissionsModule,
    RolePermissionsModule,
    // UserRolesModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard, // Global JWT authentication
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard, // Global role-based authorization
    // },
  ],
})
export class AppModule {}
