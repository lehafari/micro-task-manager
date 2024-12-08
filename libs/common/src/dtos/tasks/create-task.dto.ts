// Nestjs dependencies
import { ApiProperty } from '@nestjs/swagger';

// Other dependencies
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsUUID,
  IsOptional,
  ValidateIf,
  MinLength,
  MaxLength,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

// Lib
import { TaskStatus } from '@app/common/enums';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implement user authentication',
    description: 'Task title',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  @MaxLength(100, { message: 'Title cannot exceed 100 characters' })
  title: string;

  @ApiProperty({
    example: 'Implement JWT authentication with refresh tokens and user roles',
    description: 'Detailed task description',
    minLength: 10,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59.999Z',
    description: 'Task due date (ISO string format)',
  })
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: 'Current status of the task',
  })
  @IsEnum(TaskStatus, { message: 'Invalid task status' })
  status: TaskStatus;

  @ApiProperty({
    required: false,
    description: 'UUID of the user to assign the task to',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID('4', { message: 'Invalid user ID format' })
  @ValidateIf((o) => !o.assignedTeamId && o.assignedUserId)
  @IsOptional()
  assignedUserId?: string;

  @ApiProperty({
    required: false,
    description: 'UUID of the team to assign the task to',
    example: 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
  })
  @IsUUID('4', { message: 'Invalid team ID format' })
  @ValidateIf((o) => !o.assignedUserId && o.assignedTeamId)
  @IsOptional()
  assignedTeamId?: string;
}
