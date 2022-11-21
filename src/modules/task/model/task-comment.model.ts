import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/model/user.model';
import { Task } from './task.model';

@Table({ tableName: 'task_comments' })
export class TaskComment extends Model {
  @ForeignKey(() => Task)
  @Column({ allowNull: false })
  taskId: number;

  @BelongsTo(() => Task)
  task: Task;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column({ allowNull: false })
  comment: string;
}
