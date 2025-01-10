import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Name for permissions', example: 'Update Post' })
  @IsNotEmpty()
  @IsString()
  name: string;

  slug: string;
}
