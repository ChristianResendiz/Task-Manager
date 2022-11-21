import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsDateString,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { UserExists } from 'src/helpers/db-validators';

export class CreateTaskDTO {
  @ApiProperty({ description: 'Título de la tarea' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Descripción de la tarea' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Marcar tarea como completada' })
  @IsBooleanString()
  isCompleted: boolean;

  @ApiProperty({ description: 'Descripción de la tarea' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ description: 'Marcar tarea como pública' })
  @IsBooleanString()
  isPublic: boolean;

  @ApiProperty({
    description: 'Usuarios con los que se quiere compartir la tarea',
    type: ['integer'],
    required: false,
  })
  @Transform(({ value }) =>
    typeof value === 'string' && value
      ? value
          .trim()
          .split(',')
          .map((val) => Number(val))
      : value,
  )
  @Validate(UserExists, { each: true })
  @IsInt({ each: true })
  @IsOptional()
  sharedWithUsers?: number[];

  @ApiProperty({ description: 'Comentario de la tarea', required: false })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment: string;

  @ApiProperty({
    description: 'Usuario responsable de la tarea',
    required: false,
    type: 'integer',
  })
  @Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
  @Validate(UserExists)
  @IsInt()
  @IsOptional()
  responsibleUserId: number;

  @ApiProperty({
    description: 'Archivo para la tarea',
    format: 'binary',
    required: false,
  })
  @IsEmpty({ message: 'file must be a binary string' })
  file: string;

  // tags
}
