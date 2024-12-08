// Nestjs dependencies
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Other dependencies
import { firstValueFrom } from 'rxjs';

// Lib
import { Services } from '@app/common';
import { UpdateUserDto } from '@app/common/dtos/users';

@Injectable()
export class UserService {
  constructor(
    @Inject(Services.USERS) private readonly usersClient: ClientProxy,
  ) {}

  // User operations
  async findOne(id: string) {
    return firstValueFrom(this.usersClient.send({ cmd: 'user.findOne' }, id));
  }

  async findAll(options?: { search?: string; skip?: number; take?: number }) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'user.findAll' }, options),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return firstValueFrom(
      this.usersClient.send({ cmd: 'user.update' }, { id, updateUserDto }),
    );
  }
}
