import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedTask } from '../task/model/shared-task.model';
import { TaskComment } from '../task/model/task-comment.model';
import { Task } from '../task/model/task.model';
import { TaskService } from '../task/service/task.service';
import { User } from '../user/model/user.model';
import { FileController } from './controller/file.controller';
import { FileService } from './service/file.service';

@Module({
  imports: [SequelizeModule.forFeature([Task, SharedTask, TaskComment, User])],
  controllers: [FileController],
  providers: [FileService, TaskService],
})
export class FileModule {}
