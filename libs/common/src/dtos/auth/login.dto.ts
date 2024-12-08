// Nestjs dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'User password',
  })
  @IsString()
  password: string;
}
