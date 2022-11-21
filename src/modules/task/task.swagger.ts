import { ApiResponseOptions } from '@nestjs/swagger';
import { OperationObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const apiOperationGetAllTasks: Partial<OperationObject> = {
  summary: 'Obtener todas las tareas',
  description:
    'Obtiene todas las tareas relacinadas al usuario que inició sesión (tareas públicas, creadas o compartidas) con opción de paginación',
};

export const apiOperationGetTaskById: Partial<OperationObject> = {
  summary: 'Obtener una tarea por id',
  description: 'Obtiene una tarea especificando su id',
};

export const apiOperationCreateTask: Partial<OperationObject> = {
  summary: 'Crear una tarea',
  description: 'Crear una tarea',
};

export const apiOperationUpdateTaskById: Partial<OperationObject> = {
  summary: 'Actualizar una tarea',
  description:
    'Con base en el id y la información del body se actualiza la informaión de una tarea',
};

export const apiOperationDeleteTaskById: Partial<OperationObject> = {
  summary: 'Eliminar tarea',
  description: 'Elimina de manera lógica una tarea por id',
};

export const apiOkResponseGetAllTasks: ApiResponseOptions = {
  description:
    'La propiedad result contiene un array de tareas, mientras que la propiedad filterOptions contiene información acerca del paginado',
  schema: {
    properties: {
      result: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            title: { type: 'string' },
            description: { type: 'string' },
            isCompleted: { type: 'boolean', default: false },
            dueDate: { type: 'string' },
            isPublic: { type: 'boolean', default: false },
            creatorUserId: { type: 'integer', format: 'int64' },
            responsibleUserId: {
              type: 'string',
              format: 'int64',
              nullable: true,
            },
            status: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            taskComments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', format: 'int64' },
                  userId: { type: 'integer', format: 'int64' },
                  comment: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            file: { type: 'string', nullable: true },
            sharedWithUsers: {
              type: 'array',
              items: { type: 'integer', format: 'int64' },
            },
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

export const apiOkResponseGetTaskById: ApiResponseOptions = {
  description: 'Tarea',
  schema: {
    properties: {
      id: { type: 'integer', format: 'int64' },
      title: { type: 'string' },
      description: { type: 'string' },
      isCompleted: { type: 'boolean', default: false },
      dueDate: { type: 'string' },
      isPublic: { type: 'boolean', default: false },
      creatorUserId: { type: 'integer', format: 'int64' },
      responsibleUserId: {
        type: 'string',
        format: 'int64',
        nullable: true,
      },
      status: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      taskComments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            userId: { type: 'integer', format: 'int64' },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      file: { type: 'string', nullable: true },
      sharedWithUsers: {
        type: 'array',
        items: { type: 'integer', format: 'int64' },
      },
    },
  },
};

export const apiCreatedResponseCreateTask: ApiResponseOptions = {
  description: 'Tarea creada',
  schema: {
    properties: {
      id: { type: 'integer', format: 'int64' },
      title: { type: 'string' },
      description: { type: 'string' },
      isCompleted: { type: 'boolean', default: false },
      dueDate: { type: 'string' },
      isPublic: { type: 'boolean', default: false },
      creatorUserId: { type: 'integer', format: 'int64' },
      responsibleUserId: {
        type: 'string',
        format: 'int64',
        nullable: true,
      },
      status: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      taskComments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            userId: { type: 'integer', format: 'int64' },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      file: { type: 'string', nullable: true },
      sharedWithUsers: {
        type: 'array',
        items: { type: 'integer', format: 'int64' },
      },
    },
  },
};

export const apiOkResponseDeleteTaskById: ApiResponseOptions = {
  description: 'Tarea eliminado',
  schema: {
    properties: {
      id: { type: 'integer', format: 'int64' },
      title: { type: 'string' },
      description: { type: 'string' },
      isCompleted: { type: 'boolean', default: false },
      dueDate: { type: 'string' },
      isPublic: { type: 'boolean', default: false },
      creatorUserId: { type: 'integer', format: 'int64' },
      responsibleUserId: {
        type: 'string',
        format: 'int64',
        nullable: true,
      },
      status: { type: 'boolean' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
      taskComments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', format: 'int64' },
            userId: { type: 'integer', format: 'int64' },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      file: { type: 'string', nullable: true },
      sharedWithUsers: {
        type: 'array',
        items: { type: 'integer', format: 'int64' },
      },
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
