import { IsNotEmpty, IsString, IsOptional, ValidateNested, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class Category {
  @ApiProperty({ description: 'The ID of the category', example: '1234' })
  @IsNotEmpty()
  @IsString()
  category_id: string;
}

class GalleryData {
  @ApiProperty({ description: 'The name of the gallery', example: 'Art Exhibition' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the gallery', example: 'A collection of modern art pieces.' })
  @IsNotEmpty()
  @IsString()
  desc: string;

  @ApiProperty({ description: 'The image URL of the gallery', example: 'https://example.com/image.jpg', required: false })
  @IsOptional()
  @IsString()
  img?: string;

  @ApiProperty({ description: 'The user ID associated with the post', example: '22a80b4f-a0b5-4547-9202-fe0b3770dbce' })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

}

export class CreateGalleryDto {
  @ApiProperty({ type: GalleryData })
  @ValidateNested()
  @Type(() => GalleryData)
  data: GalleryData;

  @ApiProperty({ type: [Category], description: 'An array of categories' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];
}
