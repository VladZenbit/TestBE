import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PageOptionsRequestBodyDto {
  constructor(data: Omit<PageOptionsRequestBodyDto, 'skip'>) {
    Object.assign(this, data);
  }

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  page = 1;

  @IsInt()
  @Min(0)
  @Max(150)
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional()
  take = 10;

  @Expose()
  get skip(): number {
    return (this.page - 1) * this.take;
  }

  set skip(value) {}
}
