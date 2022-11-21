import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { CreateTaskDTO } from '../dto/create-task.dto';
import { TaskFilterOptionsDTO } from '../dto/task-filter-options.dto';
import { Task } from '../model/task.model';
import { SharedTask } from 'src/modules/task/model/shared-task.model';
import { Logger } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/modules/user/model/user.model';
import { TaskComment } from '../model/task-comment.model';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { UpdateTaskDTO } from '../dto/create-task.dto copy';
import { firstValueFrom, from } from 'rxjs';
import { map, mergeAll, skip, take, toArray } from 'rxjs/operators';

@Injectable()
export class TaskService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(Task) private taskModel: typeof Task,
    @InjectModel(SharedTask) private sharedTaskModel: typeof SharedTask,
    @InjectModel(TaskComment) private taskCommentModel: typeof TaskComment,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  async getAllTasks(
    userId: number,
    filterOptions: TaskFilterOptionsDTO,
    req: Request,
  ) {
    const { limit, page } = filterOptions;
    const offset = (page - 1) * limit || 0;
    let totalItems = 0;
    const sharedTasks = await this.sharedTaskModel.findAll({
      where: { userId },
      attributes: ['taskId'],
    });
    const where = {
      [Op.or]: {
        isPublic: true,
        creatorUserId: userId,
        id: { [Op.in]: sharedTasks.map(({ taskId: id }) => id) },
      },
      status: true,
    };
    const include = [
      {
        model: TaskComment,
        attributes: { exclude: ['taskId'] },
        include: [{ model: User, where: { status: true }, attributes: [] }],
      },
      {
        model: SharedTask,
        attributes: ['userId'],
        include: [{ model: User, where: { status: true }, attributes: [] }],
      },
    ];
    const result = await firstValueFrom(
      from(this.taskModel.findAll({ where, include })).pipe(
        map((data) => {
          totalItems = data.length;
          return from(data);
        }),
        mergeAll(),
        map(({ dataValues: task }) => {
          const { sharedTasks, fileName, ...rest } = task;
          return Object.assign(rest, {
            file: fileName
              ? `${req.protocol}://${req.get('Host')}${
                  req.originalUrl.split('task')[0]
                }files/tasks/${task.id}/${fileName}`
              : null,
            sharedWithUsers: sharedTasks?.map(({ userId: id }) => id),
          });
        }),
        skip(offset),
        take(limit || 10000000000000),
        toArray(),
      ),
    );

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

  async getTaskById(userId: number, taskId: number, req: Request) {
    const isSharedTask = await this.sharedTaskModel.findOne({
      where: { taskId, userId },
      attributes: ['taskId'],
    });

    const task = await this.taskModel.findOne({
      where: {
        id: taskId,
        [Op.or]: {
          isPublic: true,
          creatorUserId: userId,
          id: isSharedTask?.taskId || null,
        },
        status: true,
      },
      include: [
        {
          model: TaskComment,
          attributes: { exclude: ['taskId'] },
          include: [{ model: User, where: { status: true }, attributes: [] }],
        },
        {
          model: SharedTask,
          attributes: ['userId'],
          include: [{ model: User, where: { status: true }, attributes: [] }],
        },
      ],
    });

    if (!task) {
      throw new NotFoundException(`Task not found with id: ${taskId}`);
    }

    const { sharedTasks, fileName, ...rest } = task.dataValues;

    return Object.assign(rest, {
      file: fileName
        ? `${req.protocol}://${req.get('Host')}${
            req.originalUrl.split('task')[0]
          }files/tasks/${task.id}/${fileName}`
        : null,
      sharedWithUsers: sharedTasks.map(({ userId: id }) => id),
    });
  }

  async createTask(
    userId: number,
    createTaskDTO: CreateTaskDTO,
    file: Express.Multer.File,
    req: Request,
  ) {
    const {
      title,
      description,
      isCompleted,
      dueDate,
      isPublic,
      sharedWithUsers,
      comment,
      responsibleUserId,
    } = createTaskDTO;

    if (
      responsibleUserId &&
      responsibleUserId !== userId &&
      !sharedWithUsers?.includes(responsibleUserId)
    ) {
      throw new ConflictException(
        `Cannot assign userId: ${responsibleUserId} as responsible user. A task can only be assigned to a responsible user when it has been previously shared with the user. Also can be assigned to the creator user`,
      );
    }

    let generatedFileName: string;

    if (file) {
      const fileName = file.originalname.toLowerCase().split('.');
      const extension = fileName[fileName.length - 1];
      generatedFileName = `${uuidv4()}.${extension}`;
    }

    try {
      const transactionResult = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        const task = await this.taskModel.create(
          {
            title,
            description,
            isCompleted,
            dueDate,
            isPublic,
            creatorUserId: userId,
            responsibleUserId,
            fileName: generatedFileName,
          },
          transactionHost,
        );

        if (file) {
          const uploadPath = join('./uploads/', 'tasks', String(task.id));
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          writeFileSync(join(uploadPath, generatedFileName), file.buffer);
        }

        if (sharedWithUsers?.length) {
          await this.sharedTaskModel.bulkCreate(
            sharedWithUsers.map((user) => ({
              taskId: task.id,
              userId: user,
            })),
            transactionHost,
          );
        }

        if (comment) {
          await this.taskCommentModel.create(
            { taskId: task.id, userId, comment },
            transactionHost,
          );
        }
        // tags
        return task;
      });

      const task = this.getTaskById(userId, transactionResult.id, req);

      return task;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.name || error);
    }
  }

  async updateTaskById(
    userId: number,
    taskId: number,
    updateTaskDTO: UpdateTaskDTO,
    file: Express.Multer.File,
    req: Request,
  ) {
    const {
      title,
      description,
      isCompleted,
      dueDate,
      isPublic,
      sharedWithUsers,
      comment,
      responsibleUserId,
    } = updateTaskDTO;
    const task = await this.getTaskById(userId, taskId, req);

    console.log(userId);

    if (
      responsibleUserId &&
      responsibleUserId !== task.creatorUserId &&
      !sharedWithUsers?.includes(responsibleUserId) &&
      (!task.sharedWithUsers?.includes(responsibleUserId) || sharedWithUsers)
    ) {
      throw new ConflictException(
        `Cannot assign userId: ${responsibleUserId} as responsible user. A task can only be assigned to a responsible user when it has been previously shared with the user. Also can be assigned to the creator user`,
      );
    }

    let generatedFileName: string;

    if (file) {
      const fileName = file.originalname.toLowerCase().split('.');
      const extension = fileName[fileName.length - 1];
      generatedFileName = `${uuidv4()}.${extension}`;
    }

    try {
      await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        const task = await this.taskModel.findByPk(taskId, transactionHost);
        await task.update(
          {
            title,
            description,
            isCompleted,
            dueDate,
            isPublic,
            responsibleUserId,
            fileName: generatedFileName,
          },
          transactionHost,
        );

        if (file) {
          const uploadPath = join('./uploads/', 'tasks', String(task.id));
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          writeFileSync(join(uploadPath, generatedFileName), file.buffer);
        }

        if (sharedWithUsers?.length) {
          await this.sharedTaskModel.destroy({ where: { taskId } });
          await this.sharedTaskModel.bulkCreate(
            sharedWithUsers.map((user) => ({
              taskId: task.id,
              userId: user,
            })),
            transactionHost,
          );
        }

        if (comment) {
          await this.taskCommentModel.create(
            { taskId: task.id, userId, comment },
            transactionHost,
          );
        }
        // tags
        return task.id;
      });

      const taskUpdated = await this.taskModel.findByPk(task.id, {
        include: [
          {
            model: TaskComment,
            attributes: { exclude: ['taskId'] },
            include: [{ model: User, where: { status: true }, attributes: [] }],
          },
          {
            model: SharedTask,
            attributes: ['userId'],
            include: [{ model: User, where: { status: true }, attributes: [] }],
          },
        ],
      });

      const { sharedTasks, fileName, ...rest } = taskUpdated.dataValues;

      return Object.assign(rest, {
        file: fileName
          ? `${req.protocol}://${req.get('Host')}${
              req.originalUrl.split('task')[0]
            }files/tasks/${task.id}/${fileName}`
          : null,
        sharedWithUsers: sharedTasks.map(({ userId: id }) => id),
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(error.name || error);
    }
  }

  async daleteTaskById(userId: number, taskId: number, req: Request) {
    const task = await this.getTaskById(userId, taskId, req);
    const taskToDelete = await this.taskModel.findByPk(taskId);
    await taskToDelete.update({ status: false });

    const taskToDeleted = await this.taskModel.findByPk(taskToDelete.id, {
      include: [
        {
          model: TaskComment,
          attributes: { exclude: ['taskId'] },
          include: [{ model: User, where: { status: true }, attributes: [] }],
        },
        {
          model: SharedTask,
          attributes: ['userId'],
          include: [{ model: User, where: { status: true }, attributes: [] }],
        },
      ],
    });

    const { sharedTasks, fileName, ...rest } = taskToDeleted.dataValues;

    return Object.assign(rest, {
      file: fileName
        ? `${req.protocol}://${req.get('Host')}${
            req.originalUrl.split('task')[0]
          }files/tasks/${task.id}/${fileName}`
        : null,
      sharedWithUsers: sharedTasks.map(({ userId: id }) => id),
    });
  }
}
