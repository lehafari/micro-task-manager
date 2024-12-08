import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(50, { message: 'First name cannot exceed 50 characters' })
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(50, { message: 'Last name cannot exceed 50 characters' })
  lastName?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  phone?: string;
}
