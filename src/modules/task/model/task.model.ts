import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/user/model/user.model';
import { SharedTask } from './shared-task.model';
import { TaskComment } from './task-comment.model';

@Table
export class Task extends Model {
  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ defaultValue: false, allowNull: false })
  isCompleted: boolean;

  @Column({ allowNull: false })
  dueDate: Date;

  @Column({ defaultValue: false, allowNull: false })
  isPublic: boolean;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  creatorUserId: number;

  @BelongsTo(() => User, 'creatorUserId')
  creatorUser: User;

  @ForeignKey(() => User)
  @Column
  responsibleUserId: number;

  @BelongsTo(() => User, 'responsibleUserId')
  responsibleUser: User;

  @Column
  fileName: string;

  @Column({ defaultValue: true, allowNull: false })
  status: boolean;

  @HasMany(() => SharedTask)
  sharedTasks: SharedTask[];

  @HasMany(() => TaskComment)
  taskComments: TaskComment[];
}
