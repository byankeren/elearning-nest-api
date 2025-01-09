import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserRoleDto {
  @ApiProperty({
    description: 'The ID of the user',
    type: String,
  })
  @IsString() 
  user_id: string;

  @ApiProperty({
    description: 'The ID of the role',
    type: String,
  })
  @IsString() // Decorator for validation
  roles_id: string;
}
