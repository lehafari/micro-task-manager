// Nestjs dependencies
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

// Other dependencies
import { ExtractJwt, Strategy } from 'passport-jwt';

// Lib
import { JwtPayload } from '@app/common/interfaces';

// Local files
import { AppConfigService } from '../../config/services/app-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.id || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
