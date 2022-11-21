import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../dto/create-user.dto';
import { User } from '../model/user.model';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { UserFilterOptionsDTO } from '../dto/user-filter-options.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async getAllUsers(filterOptions: UserFilterOptionsDTO) {
    const { limit, page } = filterOptions;
    const offset = (page - 1) * limit || 0;
    const where = { status: true };
    const [result, totalItems] = await Promise.all([
      await this.userModel.findAll({ where, limit, offset }),
      await this.userModel.count({ where, distinct: true }),
    ]);

    return {
      result,
      filterOptions: {
        itemsPerPage: limit < totalItems ? limit : totalItems,
        currentPageItems: result.length,
        totalItems,
        currentPage: (offset + limit) / limit || 1,
        totalPages: Math.ceil(totalItems / limit) || 1,
      },
    };
  }

  async validateUser(userId: number) {
    const user = await this.userModel.findOne({
      where: { id: userId, status: true },
      raw: true,
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async getUserById(userId: number) {
    const user = await this.userModel.findOne({
      where: { id: userId, status: true },
    });

    if (!user) {
      throw new NotFoundException(`User not found with id: ${userId}`);
    }

    return user;
  }

  async createUser(createUserDTO: CreateUserDTO) {
    const { name, email, password } = createUserDTO;
    const emailExists = await this.userModel.findOne({
      where: { email },
    });

    if (emailExists) {
      throw new ConflictException(`Email '${email}' already exists`);
    }

    const user = this.userModel.build({ name, email });
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    await user.reload();

    return user;
  }

  async updateUserByid(userId: number, updateUserDTO: UpdateUserDTO) {
    const { name, email, password } = updateUserDTO;
    const user = await this.getUserById(userId);

    if (email) {
      const userDB = await this.userModel.findOne({ where: { email } });

      if (userDB && userDB.id != userId) {
        throw new ConflictException(`Email '${email}' already exists`);
      }
    }

    const data = { name, email, password };

    if (password) {
      const salt = bcrypt.genSaltSync();
      data.password = bcrypt.hashSync(password, salt);
    }

    await user.update(data);

    return user;
  }

  async daleteUserById(userId: number) {
    const user = await this.getUserById(userId);
    await user.update({ status: false });

    return user;
  }
}
