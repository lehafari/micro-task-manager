// Nestjs dependencies
import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

// Local files
import { UsersService } from '../services';
import { UpdateUserDto } from '@app/common/dtos/users';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('user.created')
  async handleUserCreated(userData: any) {
    return this.usersService.create(userData);
  }

  @MessagePattern({ cmd: 'user.findOne' })
  async findOne(id: string) {
    return this.usersService.findById(id);
  }

  @MessagePattern({ cmd: 'user.findAll' })
  async findAll(options?: { search?: string; skip?: number; take?: number }) {
    return this.usersService.findAll(options);
  }

  @MessagePattern({ cmd: 'user.update' })
  async update(data: { id: string; updateUserDto: UpdateUserDto }) {
    return this.usersService.update(data.id, data.updateUserDto);
  }

  @MessagePattern({ cmd: 'user.exists' })
  async exists(id: string) {
    return this.usersService.exists(id);
  }

  @MessagePattern({ cmd: 'user.findByEmail' })
  async findByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }
}
