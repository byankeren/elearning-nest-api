import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactUsDto {
  @ApiProperty({
    description: 'The name of the guest submitting the message',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  guest_name: string;

  @ApiProperty({
    description: 'The email of the guest',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  guest_email: string;

  @ApiProperty({
    description: 'The subject of the message',
    example: 'Inquiry about services',
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({
    description: 'The message content from the guest',
    example: 'I would like to know more about your pricing plans.',
  })
  @IsString()
  @IsNotEmpty()
  guest_message: string;
}
