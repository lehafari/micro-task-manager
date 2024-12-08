// Nestjs dependencies
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Other dependencies
import { catchError, firstValueFrom, timeout } from 'rxjs';

// Lib
import { Services } from '@app/common';
import { LoginDto, RegisterDto } from '@app/common/dtos/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Services.AUTH) private readonly authClient: ClientProxy,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'register' }, registerDto).pipe(
          timeout(10000),
          catchError((error) => {
            throw error;
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'login' }, loginDto).pipe(
          timeout(10000),
          catchError((error) => {
            console.log('ERROR: ', error);
            throw error;
          }),
        ),
      );
    } catch (error) {
      console.log('ERROR: ', error);
      throw error;
    }
  }

  async verifyToken(token: string) {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'verify_token' }, token).pipe(
          timeout(10000),
          catchError((error) => {
            throw error;
          }),
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
