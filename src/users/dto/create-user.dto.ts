import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'strongpassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: 'Facebook profile link', example: 'https://facebook.com/user' })
  @IsOptional()
  @IsString()
  @IsUrl()
  facebook_link?: string;

  @ApiPropertyOptional({ description: 'Instagram profile link', example: 'https://instagram.com/user' })
  @IsOptional()
  @IsString()
  @IsUrl()
  instagram_link?: string;

  @ApiPropertyOptional({ description: 'Twitter profile link', example: 'https://twitter.com/user' })
  @IsOptional()
  @IsString()
  @IsUrl()
  twitter_link?: string;

  @ApiPropertyOptional({ description: 'LinkedIn profile link', example: 'https://linkedin.com/in/user' })
  @IsOptional()
  @IsString()
  @IsUrl()
  linkedin_link?: string;
}
