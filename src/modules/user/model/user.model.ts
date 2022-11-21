import { Column, HasMany, Model, Table } from 'sequelize-typescript';
import { SharedTask } from 'src/modules/task/model/shared-task.model';
import { TaskComment } from 'src/modules/task/model/task-comment.model';
import { Task } from 'src/modules/task/model/task.model';

@Table
export class User extends Model {
  @Column({ allowNull: false })
  name: string;

  @Column({ unique: true, allowNull: false })
  email: string;

  @Column({ allowNull: false })
  password: string;

  @Column({ defaultValue: true, allowNull: false })
  status: boolean;

  @HasMany(() => Task, 'creatorUserId')
  createdTasks: Task[];

  @HasMany(() => Task, 'responsibleUserId')
  responsibleTasks: Task[];

  @HasMany(() => SharedTask)
  sharedTasks: SharedTask[];

  @HasMany(() => TaskComment)
  taskComments: TaskComment[];

  toJSON() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = this.get();
    return Object.assign(user);
  }
}
