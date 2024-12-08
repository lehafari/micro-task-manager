// Nestjs dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsArray,
  IsUUID,
} from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({
    description: 'Team name',
    example: 'Frontend Development Team',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Team name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Team name cannot exceed 100 characters' })
  name?: string;

  @ApiProperty({
    description: 'Team description',
    example: 'Team responsible for frontend development and UI/UX',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Array of member UUIDs',
    example: ['a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsUUID('4', { each: true, message: 'Invalid member ID format' })
  @IsOptional()
  memberIds?: string[];
}
