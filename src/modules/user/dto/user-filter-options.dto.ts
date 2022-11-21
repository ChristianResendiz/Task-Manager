import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UserFilterOptionsDTO {
  @ApiProperty({
    description: 'Número de usuarios por página',
    format: 'integer',
    required: false,
  })
  @Transform(({ value }) => (isNaN(Number(value)) ? value : Number(value)))
  @Min(1)
  @IsInt()
  @IsOptional()
  limit?: number;

  @ApiProperty({
    description: 'Número de página',
    format: 'integer',
    required: false,
  })
  @Transform(({ value }) => (isNaN(Number(value)) ? value : Number(value)))
  @Min(1)
  @IsInt()
  @IsOptional()
  page?: number;
}
