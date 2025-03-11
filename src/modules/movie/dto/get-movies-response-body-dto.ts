import { Expose } from 'class-transformer';
import { PageOptionsResponseBodyDto } from 'src/common/dto/page-options-response-body.dto';
import { MovieEntity } from 'src/entities';

import { GetMovieResponseBodyDto } from './get-movie-response-body-dto';

export class GetMoviesResponseBodyDto extends PageOptionsResponseBodyDto {
  constructor(
    data: {
      movies: MovieEntity[];
    } & ConstructorParameters<typeof PageOptionsResponseBodyDto>[0],
  ) {
    super(data);
    this.movies = data.movies.map(
      (movie) => new GetMovieResponseBodyDto(movie),
    );
  }

  @Expose()
  movies: GetMovieResponseBodyDto[];
}
