import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TaskController } from './controller/task.controller';
import { TaskService } from './service/task.service';
import { Task } from './model/task.model';
import { SharedTask } from 'src/modules/task/model/shared-task.model';
import { TaskComment } from './model/task-comment.model';
import { UserExists } from 'src/helpers/db-validators';
import { UserService } from '../user/service/user.service';
import { User } from '../user/model/user.model';

@Module({
  imports: [SequelizeModule.forFeature([Task, SharedTask, TaskComment, User])],
  controllers: [TaskController],
  providers: [TaskService, UserService, UserExists],
})
export class TaskModule {}
