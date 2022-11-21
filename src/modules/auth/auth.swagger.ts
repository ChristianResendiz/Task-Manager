import { ApiResponseOptions } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const apiOperationLogin: Partial<OperationObject> = {
  summary: 'Iniciar sesión',
  description:
    'Iniciar sesión de usuario con email y contraseña. (Este servicio también puede reactivar una cuenta de usuario inactiva)',
};

export const apiOperationCreateUser: Partial<OperationObject> = {
  summary: 'Crear una cuenta de usuario',
  description: 'Crear una cuenta de usuario que permite acceder a los recursos',
};

export const apiCreatedResponseLogin: ApiResponseOptions = {
  description: 'Login',
  schema: {
    properties: {
      user: {
        type: 'object',
        properties: {
          id: { type: 'integer', format: 'int64' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          status: { type: 'boolean', default: 'true' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      token: {
        type: 'string',
      },
    },
  },
};

export const apiCreatedResponseCreateUser: ApiResponseOptions = {
  description: 'Usuario creado',
  schema: {
    properties: {
      id: { type: 'integer', format: 'int64' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      status: { type: 'boolean', default: 'true' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
};

export const apiBadRequestResponse: ApiResponseOptions = {
  description: 'Error: Bad Request',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', format: 'int32', default: 400 },
      message: { type: 'array', items: { type: 'string' } },
      error: { type: 'string' },
    },
  },
};

export const apiConflictResponse: ApiResponseOptions = {
  description: 'Error: Conflict',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', format: 'int32', default: 409 },
      message: { type: 'string' },
      error: { type: 'string' },
    },
  },
};

export const apiUnauthorizedResponse: ApiResponseOptions = {
  description: 'Error: Unauthorized',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', format: 'int32', default: 401 },
      error: { type: 'string' },
    },
  },
};

export const apiInternalServerErrorResponse: ApiResponseOptions = {
  description: 'Error: Internal Server Error',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', format: 'int32', default: 500 },
      error: { type: 'string' },
    },
  },
};
