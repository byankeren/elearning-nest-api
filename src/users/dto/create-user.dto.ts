import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'The password of the user', example: 'strongpassword123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
