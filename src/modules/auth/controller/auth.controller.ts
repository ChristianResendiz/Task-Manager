import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import {
  apiBadRequestResponse,
  apiConflictResponse,
  apiCreatedResponseCreateUser,
  apiCreatedResponseLogin,
  apiInternalServerErrorResponse,
  apiOperationCreateUser,
  apiOperationLogin,
  apiUnauthorizedResponse,
} from '../auth.swagger';
import { LoginDTO } from '../dto/login.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@ApiTags('Auth')
@ApiBadRequestResponse(apiBadRequestResponse)
@ApiInternalServerErrorResponse(apiInternalServerErrorResponse)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation(apiOperationLogin)
  @ApiCreatedResponse(apiCreatedResponseLogin)
  @ApiUnauthorizedResponse(apiUnauthorizedResponse)
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('register')
  @ApiOperation(apiOperationCreateUser)
  @ApiCreatedResponse(apiCreatedResponseCreateUser)
  @ApiConflictResponse(apiConflictResponse)
  createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.register(createUserDTO);
  }
}
