// Nestjs dependencies
import { Controller } from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';

// Lib
import { LoginDto, RegisterDto } from '@app/common/dtos/auth';

// Local files
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'register' })
  async register(data: RegisterDto) {
    try {
      return await this.authService.register(data);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || 500,
      });
    }
  }

  @MessagePattern({ cmd: 'login' })
  login(data: LoginDto) {
    try {
      return this.authService.login(data);
    } catch (error) {
      throw new RpcException({
        message: error.message,
        statusCode: error.statusCode || 500,
      });
    }
  }

  @MessagePattern({ cmd: 'verify_token' })
  verifyToken(token: string) {
    return this.authService.verifyToken(token);
  }
}
