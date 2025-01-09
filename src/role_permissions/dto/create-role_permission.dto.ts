import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolePermissionDto {
  @ApiProperty({ description: 'ID of the role' })
  @IsString()
  @IsNotEmpty()
  role_id: string;

  @ApiProperty({ description: 'ID of the permission' })
  @IsString()
  @IsNotEmpty()
  permission_id: string;
}
