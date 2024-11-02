import { IsNotEmpty, IsString, IsInt, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ description: 'The image URL of the post', example: 'https://example.com/image.jpg' })
  @IsNotEmpty()
  @IsString()
  img: string;

  @ApiProperty({ description: 'The title of the post', example: 'A Fascinating Blog Post' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'The user ID associated with the post', example: '22a80b4f-a0b5-4547-9202-fe0b3770dbce' })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'The body content of the post', example: 'This is the content of the post.' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({ description: 'The estimated read time in minutes', example: 5 })
  @IsNotEmpty()
  @IsInt()
  read_time: number;

  @ApiProperty({ description: 'The number of views the post has', example: 100 })
  @IsNotEmpty()
  @IsInt()
  views: number;
}
