import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { User } from 'src/modules/user/model/user.model';
import { UserService } from 'src/modules/user/service/user.service';
import { LoginDTO } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private userModel: typeof User,
    private userService: UserService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const { email, password } = loginDTO;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload);
    await user.update({ status: true });

    return { user, token };
  }

  async register(createUserDTO: CreateUserDTO) {
    return await this.userService.createUser(createUserDTO);
  }
}
