// Nestjs dependencies
import { PartialType } from '@nestjs/swagger';

// Local files
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
