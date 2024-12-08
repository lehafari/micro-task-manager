// Nestjs dependencies
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

// Other dependencies
import { In, Repository } from 'typeorm';

// Local files
import { User } from '../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const existingUser = await this.userRepository.findOne({
      where: [{ id: userData.id }, { email: userData.email }],
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    id: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    },
  ) {
    const user = await this.findById(id);

    Object.assign(user, updateData);

    return this.userRepository.save(user);
  }

  async delete(id: string) {
    const user = await this.findById(id);
    return this.userRepository.remove(user);
  }

  async findMembers(memberIds: string[]) {
    return await this.userRepository.find({
      where: { id: In(memberIds) },
    });
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    orderBy?: { [key: string]: 'ASC' | 'DESC' };
  }) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: options?.skip,
      take: options?.take,
      order: options?.orderBy,
    });

    return {
      users,
      total,
      page: options?.skip
        ? Math.floor(options.skip / (options?.take || 10)) + 1
        : 1,
      pageSize: options?.take || 10,
    };
  }

  async search(query: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.email ILIKE :query', { query: `%${query}%` })
      .orWhere('user.firstName ILIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { id },
    });
    return count > 0;
  }
}
