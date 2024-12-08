// Nestjs dependencies
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

// Lib
import { JwtPayload } from '@app/common/interfaces';
import { UserRole, TaskStatus } from '@app/common/enums';
import { CreateTaskDto, UpdateTaskDto } from '@app/common/dtos/tasks';

// Local files
import { TasksService } from '../services';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
  })
  async createTask(
    @CurrentUser() user: JwtPayload,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.create({
      userId: user.id,
      createTaskDto,
    });
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all tasks with filters' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  @ApiQuery({ name: 'assignedUserId', required: false })
  @ApiQuery({ name: 'assignedTeamId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: TaskStatus,
    @Query('assignedUserId') assignedUserId?: string,
    @Query('assignedTeamId') assignedTeamId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (page - 1) * limit;

    return this.tasksService.findAll({
      userId: user.id,
      assignedUserId,
      assignedTeamId,
      status,
      skip,
      take: limit,
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Task found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Task not found' })
  async findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.tasksService.findOne({
      id,
      userId: user.id,
    });
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
  })
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update({
      id,
      userId: user.id,
      updateTaskDto,
    });
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task status updated successfully',
  })
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: TaskStatus,
  ) {
    return this.tasksService.updateStatus({
      id,
      userId: user.id,
      status,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEAM_LEADER, UserRole.ADMIN, UserRole.MEMBER)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task deleted successfully',
  })
  async delete(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.tasksService.delete({
      id,
      userId: user.id,
    });
  }

  @Get('assigned/me')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get tasks assigned to current user' })
  async findAssignedToMe(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: TaskStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (page - 1) * limit;

    return this.tasksService.findAll({
      assignedUserId: user.id,
      status,
      skip,
      take: limit,
    });
  }

  @Get('team/:teamId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get tasks assigned to a team' })
  async findTeamTasks(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Query('status') status?: TaskStatus,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (page - 1) * limit;

    return this.tasksService.findAll({
      assignedTeamId: teamId,
      status,
      skip,
      take: limit,
    });
  }
}
