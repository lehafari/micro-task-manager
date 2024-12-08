// Nestjs dependencies
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Other dependencies
import { firstValueFrom } from 'rxjs';

// Lib
import { Services } from '@app/common';
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddTeamMemberDto,
} from '@app/common/dtos/teams';

@Injectable()
export class TeamsService {
  constructor(
    @Inject(Services.USERS) private readonly usersClient: ClientProxy,
  ) {}

  async create(userId: string, createTeamDto: CreateTeamDto) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'team.create' }, { userId, createTeamDto }),
    );
  }

  async update(data: {
    id: string;
    userId: string;
    updateTeamDto: UpdateTeamDto;
  }) {
    return firstValueFrom(this.usersClient.send({ cmd: 'team.update' }, data));
  }

  async findOne(id: string) {
    return firstValueFrom(this.usersClient.send({ cmd: 'team.findOne' }, id));
  }

  async findAll(options?: {
    userId?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'team.findAll' }, options),
    );
  }

  async addMember(data: {
    id: string;
    userId: string;
    addMemberDto: AddTeamMemberDto;
  }) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'team.addMember' }, data),
    );
  }

  async removeMember(data: {
    id: string;
    userId: string;
    memberIdToRemove: string;
  }) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'team.removeMember' }, data),
    );
  }

  async delete(data: { id: string; userId: string }) {
    return firstValueFrom(this.usersClient.send({ cmd: 'team.delete' }, data));
  }

  async getMembers(teamId: string) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'team.getMembers' }, teamId),
    );
  }
}
