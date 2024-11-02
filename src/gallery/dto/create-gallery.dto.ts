import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiProperty({ description: 'The name of the gallery', example: 'Art Exhibition' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the gallery', example: 'A collection of modern art pieces.' })
  @IsNotEmpty()
  @IsString()
  desc: string;

  @ApiProperty({ description: 'The image URL of the gallery', example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsString()
  img: string;
}
