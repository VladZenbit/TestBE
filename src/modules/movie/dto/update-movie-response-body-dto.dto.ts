import { PartialType } from '@nestjs/swagger';

import { CreateMovieResponseBodyDto } from './create-movie-response-body-dto';

export class UpdateMovieResponseBodyDto extends PartialType(
  CreateMovieResponseBodyDto,
) {}
