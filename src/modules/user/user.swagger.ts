import { ApiResponseOptions } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const apiOperationGetAllUsers: Partial<OperationObject> = {
  summary: 'Obtener todos los usuarios',
  description: 'Obtiene todos los usuarios con opción de paginación',
};

export const apiOperationGetUserById: Partial<OperationObject> = {
  summary: 'Obtener un usuario por id',
  description: 'Obtiene un usuario especificando su id',
};

export const apiOperationUpdateUserById: Partial<OperationObject> = {
  summary: 'Actualizar perfil de usuario',
  description:
    'Con base en el token de autorización y la información del body se actualiza la informaión del usuario que ha iniciado sesión',
};

export const apiOperationDeleteUserById: Partial<OperationObject> = {
  summary: 'Inactivar cuenta',
  description:
    'Con base en el token de autorización se elimina de manera lógica la cuenta del usuario que ha iniciado sesión',
};

export const apiOkResponseGetAllUsers: ApiResponseOptions = {
  description:
    'La propiedad result contiene un array de usuarios, mientras que la propiedad filterOptions contiene información acerca del paginado',
  schema: {
    properties: {
      result: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            status: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      filterOptions: {
        type: 'object',
        properties: {
          itemsPerPage: { type: 'integer', format: 'int32' },
          currentPageItems: { type: 'integer', format: 'int32' },
          totalItems: { type: 'integer', format: 'int32' },
          currentPage: { type: 'integer', format: 'int32' },
          totalPages: { type: 'integer', format: 'int32' },
        },
      },
    },
  },
};

export const apiOkResponseGetUserById: ApiResponseOptions = {
  description: 'Usuario',
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

export const apiOkResponseDeleteUserById: ApiResponseOptions = {
  description: 'Usuario eliminado',
  schema: {
    properties: {
      id: { type: 'integer', format: 'int64' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      status: { type: 'boolean', default: 'false' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
};

export const apiOkResponse: ApiResponseOptions = {
  description: 'The info has been successfully updated',
  schema: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
      },
      status: {
        type: 'boolean',
      },
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

export const apiNotFoundResponse: ApiResponseOptions = {
  description: 'Error: Not found',
  schema: {
    type: 'object',
    properties: {
      statusCode: { type: 'integer', format: 'int32', default: 404 },
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
