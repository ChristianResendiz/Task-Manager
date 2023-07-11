import { SequelizeModuleOptions } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { SharedTask } from 'src/modules/task/model/shared-task.model';
import { TaskComment } from 'src/modules/task/model/task-comment.model';
import { Task } from 'src/modules/task/model/task.model';
import { User } from 'src/modules/user/model/user.model';
dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getSequelizeConfig(): SequelizeModuleOptions {
    return {
      dialect: 'mysql',
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USER'),
      // password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_DATABASE'),
      autoLoadModels: true,
      // sync: { force: true },
      synchronize: true,
      // logging: false,
      models: [User, Task, SharedTask, TaskComment],
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DB_HOST',
  'DB_PORT',
  'DB_USER',
  'DB_PASSWORD',
  'DB_DATABASE',
]);

export { configService };
