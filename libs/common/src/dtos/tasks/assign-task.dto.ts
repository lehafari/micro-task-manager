// Nestjs dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import { IsUUID, IsOptional, ValidateIf } from 'class-validator';

export class AssignTaskDto {
  @ApiProperty({ required: false })
  @IsUUID()
  @ValidateIf((o) => !o.teamId)
  @IsOptional()
  userId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @ValidateIf((o) => !o.userId)
  @IsOptional()
  teamId?: string;
}
