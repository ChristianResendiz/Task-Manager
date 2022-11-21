import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { configService } from './config/config.service';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot(configService.getSequelizeConfig()),
    AuthModule,
    UserModule,
    TaskModule,
    FileModule,
  ],
})
export class AppModule {}
