import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  async validate(payload: any) {
    try {
      return await this.userService.validateUser(payload.id);
    } catch (error) {
      if (error.status !== 401) {
        Logger.error(error);
      }
      throw new HttpException(
        error.response || error.name || error,
        error.status || 500,
      );
    }
  }
}
