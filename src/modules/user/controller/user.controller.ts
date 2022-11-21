import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from '../service/user.service';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  apiBadRequestResponse,
  apiConflictResponse,
  apiInternalServerErrorResponse,
  apiNotFoundResponse,
  apiOkResponseDeleteUserById,
  apiOkResponseGetAllUsers,
  apiOkResponseGetUserById,
  apiOperationDeleteUserById,
  apiOperationGetAllUsers,
  apiOperationGetUserById,
  apiOperationUpdateUserById,
  apiUnauthorizedResponse,
} from '../user.swagger';
import { UserFilterOptionsDTO } from '../dto/user-filter-options.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiBadRequestResponse(apiBadRequestResponse)
@ApiUnauthorizedResponse(apiUnauthorizedResponse)
@ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOperation(apiOperationGetAllUsers)
  @ApiOkResponse(apiOkResponseGetAllUsers)
  getAllUsers(@Query() filterOptions: UserFilterOptionsDTO) {
    return this.userService.getAllUsers(filterOptions);
  }

  @Get(':userId')
  @ApiOperation(apiOperationGetUserById)
  @ApiOkResponse(apiOkResponseGetUserById)
  @ApiNotFoundResponse(apiNotFoundResponse)
  getUserById(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserById(userId);
  }

  @Patch()
  @ApiOperation(apiOperationUpdateUserById)
  @ApiOkResponse(apiOkResponseGetUserById)
  @ApiConflictResponse(apiConflictResponse)
  updateUserById(@Body() updateUserDTO: UpdateUserDTO, @Req() req: Request) {
    const userId: number = req.user['id'];
    return this.userService.updateUserByid(userId, updateUserDTO);
  }

  @Delete()
  @ApiOperation(apiOperationDeleteUserById)
  @ApiOkResponse(apiOkResponseDeleteUserById)
  deleteUserById(@Req() req: Request) {
    const userId: number = req.user['id'];
    return this.userService.daleteUserById(userId);
  }
}
