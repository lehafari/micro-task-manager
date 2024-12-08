// Nestjs dependencies
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Other dependencies
import { Repository } from 'typeorm';

// Lib
import {
  CreateTeamDto,
  UpdateTeamDto,
  AddTeamMemberDto,
} from '@app/common/dtos/teams';
import { BaseException } from '@app/common/exceptions';

// Local files
import { Team } from '../entities/team.entity';
import { UsersService } from '../../core/services';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly userService: UsersService,
  ) {}

  async create(userId: string, createTeamDto: CreateTeamDto) {
    try {
      const creator = await this.userService.findById(userId);

      if (!creator) {
        throw new BaseException('Creator user not found', 404);
      }

      if (createTeamDto.memberIds?.length) {
        const members = await this.userService.findMembers(
          createTeamDto.memberIds,
        );
        if (members.length !== createTeamDto.memberIds.length) {
          throw new BaseException('Some team members were not found', 404);
        }
      }

      const team = this.teamRepository.create({
        ...createTeamDto,
        creatorId: userId,
        members: createTeamDto.memberIds
          ? await this.userService.findMembers(createTeamDto.memberIds)
          : [],
      });

      // Always add creator as member if not already included
      if (!team.members.some((member) => member.id === userId)) {
        const creator = await this.userService.findById(userId);
        team.members.push(creator);
      }

      await this.teamRepository.save(team);
      return this.findOne(team.id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error creating team: ${error.message}`, 500);
    }
  }

  async update(id: string, userId: string, updateTeamDto: UpdateTeamDto) {
    try {
      const team = await this.findOne(id);

      // Verify user has permission to update (creator only)
      if (team.creatorId !== userId) {
        throw new BaseException('Unauthorized to update team', 403);
      }

      // Update basic team info
      Object.assign(team, updateTeamDto);
      await this.teamRepository.save(team);

      return this.findOne(id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error updating team: ${error.message}`, 500);
    }
  }

  async addMember(id: string, userId: string, addMemberDto: AddTeamMemberDto) {
    try {
      const team = await this.findOne(id);

      // Verify user has permission (creator only)
      if (team.creatorId !== userId) {
        throw new BaseException('Unauthorized to add team members', 403);
      }

      // Verify member to add exists
      const newMember = await this.userService.findById(addMemberDto.userId);

      if (!newMember) {
        throw new BaseException('User to add not found', 404);
      }

      // Check if user is already a member
      if (team.members.some((member) => member.id === addMemberDto.userId)) {
        throw new BaseException('User is already a team member', 400);
      }

      // Add new member
      team.members.push(newMember);
      await this.teamRepository.save(team);

      return this.findOne(id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(
        `Error adding team member: ${error.message}`,
        500,
      );
    }
  }

  async removeMember(id: string, userId: string, memberIdToRemove: string) {
    try {
      const team = await this.findOne(id);

      // Verify user has permission (creator only)
      if (team.creatorId !== userId) {
        throw new BaseException('Unauthorized to remove team members', 403);
      }

      // Cannot remove creator
      if (memberIdToRemove === team.creatorId) {
        throw new BaseException('Cannot remove team creator', 400);
      }

      // Verify member exists in team
      if (!team.members.some((member) => member.id === memberIdToRemove)) {
        throw new BaseException('User is not a team member', 404);
      }

      // Remove member
      team.members = team.members.filter(
        (member) => member.id !== memberIdToRemove,
      );
      await this.teamRepository.save(team);

      return this.findOne(id);
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(
        `Error removing team member: ${error.message}`,
        500,
      );
    }
  }

  async delete(id: string, userId: string) {
    try {
      const team = await this.findOne(id);

      // Verify user has permission (creator only)
      if (team.creatorId !== userId) {
        throw new BaseException('Unauthorized to delete team', 403);
      }

      await this.teamRepository.remove(team);
      return { success: true, message: 'Team deleted successfully' };
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error deleting team: ${error.message}`, 500);
    }
  }

  async findOne(id: string) {
    try {
      const team = await this.teamRepository.findOne({
        where: { id },
        relations: ['members'],
      });

      if (!team) {
        throw new BaseException('Team not found', 404);
      }

      return team;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(`Error finding team: ${error.message}`, 500);
    }
  }

  async findAll(options?: {
    userId?: string;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    try {
      const query = this.teamRepository
        .createQueryBuilder('team')
        .leftJoinAndSelect('team.members', 'member');

      // Filter teams where user is member or creator
      if (options?.userId) {
        query
          .where('team.creatorId = :userId', { userId: options.userId })
          .orWhere('member.id = :userId', { userId: options.userId });
      }

      // Search by name
      if (options?.search) {
        query.andWhere('team.name ILIKE :search', {
          search: `%${options.search}%`,
        });
      }

      // Pagination
      if (options?.skip !== undefined) {
        query.skip(options.skip);
      }

      if (options?.take !== undefined) {
        query.take(options.take);
      }

      const [teams, total] = await query.getManyAndCount();

      return {
        teams,
        meta: {
          total,
          page: options?.skip
            ? Math.floor(options.skip / (options?.take || 10)) + 1
            : 1,
          pageSize: options?.take || 10,
        },
      };
    } catch (error) {
      throw new BaseException(`Error retrieving teams: ${error.message}`, 500);
    }
  }

  async isMember(teamId: string, userId: string): Promise<boolean> {
    try {
      const team = await this.findOne(teamId);
      return team.members.some((member) => member.id === userId);
    } catch {
      return false;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const count = await this.teamRepository.count({
        where: { id },
      });
      return count > 0;
    } catch {
      return false;
    }
  }

  async getMembers(teamId: string) {
    try {
      const team = await this.findOne(teamId);
      return team.members;
    } catch (error) {
      if (error instanceof BaseException) throw error;
      throw new BaseException(
        `Error getting team members: ${error.message}`,
        500,
      );
    }
  }
}
