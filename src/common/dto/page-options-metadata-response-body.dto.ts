import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PageOptionsMetadataResponseBodyDto {
  constructor(
    data: Omit<
      PageOptionsMetadataResponseBodyDto,
      'pagesAmount' | 'hasPrev' | 'hasNext'
    >,
  ) {
    Object.assign(this, data);
  }

  @Expose()
  @ApiProperty()
  page: number;

  @Expose()
  @ApiProperty()
  take: number;

  @Expose()
  @ApiProperty()
  itemsAmount: number;

  @Expose()
  @ApiProperty()
  get pagesAmount(): number {
    return Math.ceil(this.itemsAmount / this.take);
  }

  @Expose()
  @ApiProperty()
  get hasPrev(): boolean {
    return this.page > 1;
  }

  @Expose()
  @ApiProperty()
  get hasNext(): boolean {
    return this.page < this.pagesAmount;
  }
}
