import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateMovieResponseBodyDto {
  @IsString()
  @ApiProperty({ description: 'Name of the movie' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Description of the movie' })
  description: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Document file',
  })
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  movieImage: Express.Multer.File;
}
