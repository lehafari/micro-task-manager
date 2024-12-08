// Nestjs dependencies
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Lib
import { TaskStatus } from '@app/common/enums';
import { CreateTaskDto, UpdateTaskDto } from '@app/common/dtos/tasks';

// Local files
import { TasksService } from '../services';

@Controller()
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern({ cmd: 'task.create' })
  create(@Payload() data: { userId: string; createTaskDto: CreateTaskDto }) {
    return this.tasksService.create(data.userId, data.createTaskDto);
  }

  @MessagePattern({ cmd: 'task.update' })
  update(
    @Payload()
    data: {
      id: string;
      userId: string;
      updateTaskDto: UpdateTaskDto;
    },
  ) {
    return this.tasksService.update(data.id, data.userId, data.updateTaskDto);
  }

  @MessagePattern({ cmd: 'task.updateStatus' })
  updateStatus(
    @Payload()
    data: {
      id: string;
      userId: string;
      status: TaskStatus;
    },
  ) {
    return this.tasksService.updateStatus(data.id, data.userId, data.status);
  }

  @MessagePattern({ cmd: 'task.delete' })
  delete(@Payload() data: { id: string; userId: string }) {
    return this.tasksService.delete(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'task.findOne' })
  findOne(@Payload() data: { id: string }) {
    return this.tasksService.findOne(data.id);
  }

  @MessagePattern({ cmd: 'task.findAll' })
  findAll(
    @Payload()
    options?: {
      userId?: string;
      assignedUserId?: string;
      assignedTeamId?: string;
      status?: TaskStatus;
      skip?: number;
      take?: number;
    },
  ) {
    return this.tasksService.findAll(options);
  }
}
