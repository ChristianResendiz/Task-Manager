import { HttpException, Injectable, Logger } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from 'src/modules/user/service/user.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExists implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(userId: number) {
    try {
      await this.userService.getUserById(userId);
    } catch (error) {
      if (error.status !== 404) {
        Logger.error(error);
      }
      throw new HttpException(
        error.response || error.name || error,
        error.status || 500,
      );
    }

    return true;
  }
}
