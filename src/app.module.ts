import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PostsModule } from './posts/posts.module';
import { GalleryModule } from './gallery/gallery.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, AuthModule, RolesModule, PostsModule, GalleryModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
