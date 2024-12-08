// Nestjs dependencies
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Other dependencies
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

// Lib
import { Services } from '@app/common';
import { TaskStatus } from '@app/common/enums';
import { BaseException } from '@app/common/exceptions';
import { CreateTaskDto, UpdateTaskDto } from '@app/common/dtos/tasks';

// Local files
import { Task } from '../entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @Inject(Services.USERS) private readonly usersClient: ClientProxy,
  ) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    try {
      // Validate assignee if provided
      if (createTaskDto.assignedUserId) {
        const userExists = await this.validateUser(
          createTaskDto.assignedUserId,
        );
        if (!userExists) {
          throw new BaseException('Assigned user not found', 404);
        }
      }

      if (createTaskDto.assignedTeamId) {
        const teamExists = await this.validateTeam(
          createTaskDto.assignedTeamId,
        );
        if (!teamExists) {
          throw new BaseException('Assigned team not found', 404);
        }
      }

      const task = this.taskRepository.create({
        ...createTaskDto,
        userId,
      });

      const savedTask = await this.taskRepository.save(task);
      return this.findOne(savedTask.id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error creating task: ${error.message}`, 500);
    }
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto) {
    try {
      const task = await this.findOne(id);

      // Validate ownership
      if (task.userId !== userId) {
        throw new BaseException('Unauthorized to update this task', 403);
      }

      // Validate assignee if being updated
      if (updateTaskDto.assignedUserId) {
        const userExists = await this.validateUser(
          updateTaskDto.assignedUserId,
        );
        if (!userExists) {
          throw new BaseException('Assigned user not found', 404);
        }
      }

      if (updateTaskDto.assignedTeamId) {
        const teamExists = await this.validateTeam(
          updateTaskDto.assignedTeamId,
        );
        if (!teamExists) {
          throw new BaseException('Assigned team not found', 404);
        }
      }

      // Update task
      Object.assign(task, updateTaskDto);
      await this.taskRepository.save(task);

      return this.findOne(id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error updating task: ${error.message}`, 500);
    }
  }

  async updateStatus(id: string, userId: string, status: TaskStatus) {
    try {
      const task = (await this.findOne(id)) as Task;

      // Validate ownership or assignment
      if (!(await this.canModifyTask(task, userId))) {
        throw new BaseException('Unauthorized to update this task status', 403);
      }

      task.status = status;
      await this.taskRepository.save(task);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(
        `Error updating task status: ${error.message}`,
        500,
      );
    }
  }

  async delete(id: string, userId: string) {
    try {
      const task = (await this.findOne(id)) as Task;

      // Only task creator can delete
      if (task.userId !== userId) {
        throw new BaseException('Unauthorized to delete this task', 403);
      }

      await this.taskRepository.remove(task);
      return { success: true, message: 'Task deleted successfully' };
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error deleting task: ${error.message}`, 500);
    }
  }

  async findOne(id: string) {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
      });

      if (!task) {
        throw new BaseException('Task not found', 404);
      }

      // Get assignee details if task is assigned
      if (task.assignedUserId) {
        const assignedUser = await firstValueFrom(
          this.usersClient.send({ cmd: 'user.findOne' }, task.assignedUserId),
        );
        return { ...task, assignedUser };
      }

      if (task.assignedTeamId) {
        const assignedTeam = await firstValueFrom(
          this.usersClient.send({ cmd: 'team.findOne' }, task.assignedTeamId),
        );
        return { ...task, assignedTeam };
      }

      return task;
    } catch (error) {
      console.log('ERROR: ', error);
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error finding task: ${error.message}`, 500);
    }
  }

  async findAll(options: {
    userId?: string;
    assignedUserId?: string;
    assignedTeamId?: string;
    status?: TaskStatus;
    skip?: number;
    take?: number;
  }) {
    try {
      const query = this.taskRepository.createQueryBuilder('task');

      // Base filters
      if (options.userId) {
        query.andWhere('task.userId = :userId', { userId: options.userId });
      }

      if (options.assignedUserId) {
        query.andWhere('task.assignedUserId = :assignedUserId', {
          assignedUserId: options.assignedUserId,
        });
      }

      if (options.assignedTeamId) {
        query.andWhere('task.assignedTeamId = :assignedTeamId', {
          assignedTeamId: options.assignedTeamId,
        });
      }

      if (options.status) {
        query.andWhere('task.status = :status', { status: options.status });
      }

      // Pagination
      if (options.skip !== undefined) {
        query.skip(options.skip);
      }

      if (options.take !== undefined) {
        query.take(options.take);
      }

      // Order by creation date
      query.orderBy('task.createdAt', 'DESC');

      const [tasks, total] = await query.getManyAndCount();

      return {
        tasks,
        meta: {
          total,
          page: options?.skip
            ? Math.floor(options.skip / (options?.take || 10)) + 1
            : 1,
          pageSize: options?.take || 10,
        },
      };
    } catch (error) {
      throw new BaseException(`Error retrieving tasks: ${error.message}`, 500);
    }
  }

  // Helper methods
  private async validateUser(userId: string): Promise<boolean> {
    try {
      return await firstValueFrom(
        this.usersClient.send({ cmd: 'user.findOne' }, userId),
      );
    } catch {
      return false;
    }
  }

  private async validateTeam(teamId: string): Promise<boolean> {
    try {
      return await firstValueFrom(
        this.usersClient.send({ cmd: 'team.exists' }, teamId),
      );
    } catch {
      return false;
    }
  }

  private async canModifyTask(task: Task, userId: string): Promise<boolean> {
    // Creator can always modify
    if (task.userId === userId) return true;

    // Assigned user can modify
    if (task.assignedUserId === userId) return true;

    // Check if user is part of assigned team
    if (task.assignedTeamId) {
      try {
        const isTeamMember = await firstValueFrom(
          this.usersClient.send(
            { cmd: 'team.isMember' },
            { teamId: task.assignedTeamId, userId },
          ),
        );
        return isTeamMember;
      } catch {
        return false;
      }
    }

    return false;
  }
}
