import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  apiBadRequestResponse,
  apiInternalServerErrorResponse,
  apiUnauthorizedResponse,
} from 'src/modules/user/user.swagger';
import { CreateTaskDTO } from '../dto/create-task.dto';
import { TaskFilterOptionsDTO } from '../dto/task-filter-options.dto';
import { TaskService } from '../service/task.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateTaskDTO } from '../dto/create-task.dto copy';
import {
  apiConflictResponse,
  apiCreatedResponseCreateTask,
  apiNotFoundResponse,
  apiOkResponseDeleteTaskById,
  apiOkResponseGetAllTasks,
  apiOkResponseGetTaskById,
  apiOperationCreateTask,
  apiOperationDeleteTaskById,
  apiOperationGetAllTasks,
  apiOperationGetTaskById,
  apiOperationUpdateTaskById,
} from '../task.swagger';

@Controller('tasks')
@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiBadRequestResponse(apiBadRequestResponse)
@ApiUnauthorizedResponse(apiUnauthorizedResponse)
@ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOperation(apiOperationGetAllTasks)
  @ApiOkResponse(apiOkResponseGetAllTasks)
  getAllTasks(
    @Query() filterOptions: TaskFilterOptionsDTO,
    @Req() req: Request,
  ) {
    const userId: number = req.user['id'];
    return this.taskService.getAllTasks(userId, filterOptions, req);
  }

  @Get(':taskId')
  @ApiOperation(apiOperationGetTaskById)
  @ApiOkResponse(apiOkResponseGetTaskById)
  @ApiNotFoundResponse(apiNotFoundResponse)
  getTaskById(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: Request,
  ) {
    const userId: number = req.user['id'];
    return this.taskService.getTaskById(userId, taskId, req);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation(apiOperationCreateTask)
  @ApiCreatedResponse(apiCreatedResponseCreateTask)
  @ApiConflictResponse(apiConflictResponse)
  createTask(
    @Body() createTaskDTO: CreateTaskDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /(jpg|png|pdf)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId: number = req.user['id'];
    return this.taskService.createTask(userId, createTaskDTO, file, req);
  }

  @Patch(':taskId')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation(apiOperationUpdateTaskById)
  @ApiCreatedResponse(apiCreatedResponseCreateTask)
  @ApiConflictResponse(apiConflictResponse)
  updateTaskById(
    @Body() updateTaskDTO: UpdateTaskDTO,
    @Param('taskId', ParseIntPipe) taskId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /(jpg|png|pdf)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId: number = req.user['id'];
    return this.taskService.updateTaskById(
      userId,
      taskId,
      updateTaskDTO,
      file,
      req,
    );
  }

  @Delete(':taskId')
  @ApiOperation(apiOperationDeleteTaskById)
  @ApiOkResponse(apiOkResponseDeleteTaskById)
  deleteTaskById(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() req: Request,
  ) {
    const userId: number = req.user['id'];
    return this.taskService.daleteTaskById(userId, taskId, req);
  }
}
