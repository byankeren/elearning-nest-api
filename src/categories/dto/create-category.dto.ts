import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Image URL for the category', example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsString()
  img: string;

  @ApiProperty({ description: 'Title of the category', example: 'Technology' })
  @IsNotEmpty()
  @IsString()
  title: string;
}
