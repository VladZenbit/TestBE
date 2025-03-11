import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetMovieResponseBodyDto {
  @Expose()
  @ApiProperty({ description: 'Unique identifier for the movie' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'Name of the movie' })
  name: string;

  @Expose()
  @ApiProperty({ description: 'Description of the movie' })
  description: string;

  @Expose()
  @ApiProperty({ description: 'URL of the movie image' })
  imageUrl: string;

  @Expose()
  @ApiProperty({ description: 'Created date of the movie' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'Updated date of the movie' })
  updatedAt: Date;

  constructor(data: Partial<GetMovieResponseBodyDto>) {
    Object.assign(this, data);
  }
}
