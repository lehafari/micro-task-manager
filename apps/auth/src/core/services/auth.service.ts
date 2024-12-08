// Nestjs dependencies
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

// Other dependencies
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';

// Lib
import { Services } from '@app/common';
import { LoginDto, RegisterDto } from '@app/common/dtos/auth';

// Local files
import { AuthUser as User } from '../entities';
import { firstValueFrom } from 'rxjs';
import { BaseException } from '@app/common/exceptions';
import { JwtPayload } from '@app/common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(Services.USERS) private readonly usersClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BaseException('User already exists', 409);
    }

    const authUser = this.userRepository.create({
      email: registerDto.email,
      password: registerDto.password,
    });

    await this.userRepository.save(authUser);

    try {
      const userData = {
        id: authUser.id,
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
      };

      await firstValueFrom(this.usersClient.emit('user.created', userData));

      const token = this.generateToken(authUser);

      return {
        id: authUser.id,
        email: authUser.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        token,
      };
    } catch (error) {
      await this.userRepository.remove(authUser);
      throw new BaseException(`Error creating user: ${error.message}`, 500);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user || !(await compare(loginDto.password, user.password))) {
      throw new BaseException('Credenciales inválidas', 404);
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userRepository.findOne({
        where: { id: payload.id },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException();
      }

      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private generateToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
}
