// Nestjs dependencies
import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  Post,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

// Lib
import {
  AddTeamMemberDto,
  CreateTeamDto,
  UpdateTeamDto,
} from '@app/common/dtos/teams';
import { UserRole } from '@app/common/enums';
import { JwtPayload } from '@app/common/interfaces';

// Local files
import { TeamsService } from '../services';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.TEAM_LEADER)
  @ApiOperation({ summary: 'Create a new team' })
  @ApiResponse({ status: 201, description: 'Team created successfully' })
  createTeam(
    @CurrentUser() user: JwtPayload,
    @Body() createTeamDto: CreateTeamDto,
  ) {
    return this.teamsService.create(user.id, createTeamDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all teams' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAllTeams(
    @CurrentUser() user: JwtPayload,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (page - 1) * limit;
    return this.teamsService.findAll({
      userId: user.id,
      search,
      skip,
      take: limit,
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get team by ID' })
  findTeam(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update team' })
  updateTeam(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update({
      id,
      userId: user.id,
      updateTeamDto,
    });
  }

  @Post(':id/members')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add team member' })
  addTeamMember(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addMemberDto: AddTeamMemberDto,
  ) {
    return this.teamsService.addMember({
      id,
      userId: user.id,
      addMemberDto,
    });
  }

  @Delete(':id/members/:memberId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove team member' })
  removeTeamMember(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
  ) {
    return this.teamsService.removeMember({
      id,
      userId: user.id,
      memberIdToRemove: memberId,
    });
  }

  @Get(':id/members')
  @UseGuards(RolesGuard)
  @Roles(UserRole.MEMBER, UserRole.TEAM_LEADER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get team members' })
  getTeamMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.teamsService.getMembers(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete team' })
  deleteTeam(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.teamsService.delete({
      id,
      userId: user.id,
    });
  }
}
