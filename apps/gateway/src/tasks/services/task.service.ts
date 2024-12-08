// Nestjs dependencies
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Other dependencies
import { firstValueFrom } from 'rxjs';

// Lib
import { Services } from '@app/common';
import { TaskStatus } from '@app/common/enums';
import { CreateTaskDto, UpdateTaskDto } from '@app/common/dtos/tasks';

@Injectable()
export class TasksService {
  constructor(
    @Inject(Services.TASKS) private readonly tasksClient: ClientProxy,
  ) {}

  async create(data: { userId: string; createTaskDto: CreateTaskDto }) {
    return firstValueFrom(this.tasksClient.send({ cmd: 'task.create' }, data));
  }

  async findAll(options: {
    userId?: string;
    assignedUserId?: string;
    assignedTeamId?: string;
    status?: TaskStatus;
    skip?: number;
    take?: number;
  }) {
    return firstValueFrom(
      this.tasksClient.send({ cmd: 'task.findAll' }, options),
    );
  }

  async findOne(data: { id: string; userId: string }) {
    return firstValueFrom(
      this.tasksClient.send({ cmd: 'task.findOne' }, { id: data.id }),
    );
  }

  async update(data: {
    id: string;
    userId: string;
    updateTaskDto: UpdateTaskDto;
  }) {
    return firstValueFrom(this.tasksClient.send({ cmd: 'task.update' }, data));
  }

  async updateStatus(data: { id: string; userId: string; status: TaskStatus }) {
    return firstValueFrom(
      this.tasksClient.send({ cmd: 'task.updateStatus' }, data),
    );
  }

  async delete(data: { id: string; userId: string }) {
    return firstValueFrom(this.tasksClient.send({ cmd: 'task.delete' }, data));
  }
}
