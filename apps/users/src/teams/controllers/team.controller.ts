// Nestjs dependencies
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Lib
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddTeamMemberDto,
} from '@app/common/dtos/teams';

// Local files
import { TeamsService } from '../services';

@Controller()
export class TeamController {
  constructor(private readonly teamsService: TeamsService) {}

  @MessagePattern({ cmd: 'team.create' })
  create(@Payload() data: { userId: string; createTeamDto: CreateTeamDto }) {
    return this.teamsService.create(data.userId, data.createTeamDto);
  }

  @MessagePattern({ cmd: 'team.update' })
  update(
    @Payload()
    data: {
      id: string;
      userId: string;
      updateTeamDto: UpdateTeamDto;
    },
  ) {
    return this.teamsService.update(data.id, data.userId, data.updateTeamDto);
  }

  @MessagePattern({ cmd: 'team.addMember' })
  addMember(
    @Payload()
    data: {
      id: string;
      userId: string;
      addMemberDto: AddTeamMemberDto;
    },
  ) {
    return this.teamsService.addMember(data.id, data.userId, data.addMemberDto);
  }

  @MessagePattern({ cmd: 'team.removeMember' })
  removeMember(
    @Payload()
    data: {
      id: string;
      userId: string;
      memberIdToRemove: string;
    },
  ) {
    return this.teamsService.removeMember(
      data.id,
      data.userId,
      data.memberIdToRemove,
    );
  }

  @MessagePattern({ cmd: 'team.delete' })
  delete(@Payload() data: { id: string; userId: string }) {
    return this.teamsService.delete(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'team.findOne' })
  findOne(@Payload() id: string) {
    return this.teamsService.findOne(id);
  }

  @MessagePattern({ cmd: 'team.findAll' })
  findAll(
    @Payload()
    options?: {
      userId?: string;
      search?: string;
      skip?: number;
      take?: number;
    },
  ) {
    return this.teamsService.findAll(options);
  }

  @MessagePattern({ cmd: 'team.isMember' })
  isMember(@Payload() data: { teamId: string; userId: string }) {
    return this.teamsService.isMember(data.teamId, data.userId);
  }

  @MessagePattern({ cmd: 'team.exists' })
  exists(@Payload() id: string) {
    return this.teamsService.exists(id);
  }

  @MessagePattern({ cmd: 'team.getMembers' })
  getMembers(@Payload() teamId: string) {
    return this.teamsService.getMembers(teamId);
  }
}
