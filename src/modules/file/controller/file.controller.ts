import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiOkResponseGetTaskFile,
  apiOperationGetTaskFile,
  apiUnauthorizedResponse,
} from '../file.swagger';
import { FileService } from '../service/file.service';

@Controller('files')
@ApiTags('Files')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse(apiUnauthorizedResponse)
@ApiNotFoundResponse(apiNotFoundResponse)
@ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('tasks/:taskId/:fileName')
  @ApiOperation(apiOperationGetTaskFile)
  @ApiOkResponse(apiOkResponseGetTaskFile)
  getTaskFile(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Param('fileName') fileName: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId: number = req.user['id'];
    return this.fileService.getTaskFile(userId, taskId, fileName, req, res);
  }
}
