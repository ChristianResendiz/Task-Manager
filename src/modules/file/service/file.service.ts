import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { TaskService } from 'src/modules/task/service/task.service';
import { NotFoundException } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor(private taskService: TaskService) {}

  async getTaskFile(
    userId: number,
    taskId: number,
    fileName: string,
    req: Request,
    res: Response,
  ) {
    try {
      const task = await this.taskService.getTaskById(userId, taskId, req);

      if (!task.file.includes(fileName)) {
        throw new NotFoundException('File not found');
      }

      const filePath = join('./uploads/', 'tasks', String(taskId), fileName);
      const buffer = readFileSync(filePath);

      res.end(buffer);
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('File not found');
      }
      Logger.error(error);
      throw new HttpException(
        error.response || error.name || error,
        error.status || 500,
      );
    }
  }
}
