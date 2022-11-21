import { ApiResponseOptions } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const apiOperationGetTaskFile: Partial<OperationObject> = {
  summary: 'Obtener un archivo de una tarea',
  description: 'Obtiene un archivo de una tarea',
};

export const apiOkResponseGetTaskFile: ApiResponseOptions = {
  description: 'Archivo de una tarea',
  schema: {
    type: 'file',
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
