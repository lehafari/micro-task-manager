// Nestjs dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  memberIds: string[];
}
