// Nestjs dependencies
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Headers,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

// Lib
import { LoginDto, RegisterDto } from '@app/common/dtos/auth';

// Local files
import { AuthService } from '../services';
import { RpcExceptionInterceptor } from '../../interceptors';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(RpcExceptionInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged in',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify JWT token' })
  async verifyToken(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1];
    return this.authService.verifyToken(token);
  }
}
