import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOkResponse,
  ApiConsumes,
  ApiExtraModels,
} from '@nestjs/swagger';
import { MovieEntity } from 'src/entities';

import { GetUser } from '../users/decorators/get-user.decorators';
import { UserProfileDto } from '../users/dto/user-profile.dto';

import { CreateMovieResponseBodyDto } from './dto/create-movie-response-body-dto';
import { GetAllMoviesequestQuery } from './dto/get-all-movies-request.dto';
import { GetMovieResponseBodyDto } from './dto/get-movie-response-body-dto';
import { GetMoviesResponseBodyDto } from './dto/get-movies-response-body-dto';
import { UpdateMovieResponseBodyDto } from './dto/update-movie-response-body-dto.dto';
import { MovieService } from './movie.service';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @UseInterceptors(FileInterceptor('movieImage'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Create a new movie', type: MovieEntity })
  @ApiExtraModels(CreateMovieResponseBodyDto)
  async createMovie(
    @GetUser() user,
    @Body() body: CreateMovieResponseBodyDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '(image/png|image/jpeg|image/svg)' })
        .build({ fileIsRequired: false }),
    )
    movieImage: Express.Multer.File,
  ): Promise<GetMovieResponseBodyDto> {
    body.movieImage = movieImage;

    const movie = await this.movieService.createMovie(body, user);

    return new GetMovieResponseBodyDto(movie);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('movieImage'))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ description: 'Update a movie', type: MovieEntity })
  async updateMovie(
    @GetUser() user: UserProfileDto,
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieResponseBodyDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '(image/png|image/jpeg|image/svg)' })
        .build({ fileIsRequired: false }),
    )
    movieImage?: Express.Multer.File,
  ): Promise<GetMovieResponseBodyDto> {
    updateMovieDto.movieImage = movieImage;

    const movie = await this.movieService.updateMovie(id, updateMovieDto, user);

    return new GetMovieResponseBodyDto(movie);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get a movie by ID', type: MovieEntity })
  async getMovieById(
    @Param('id') id: string,
  ): Promise<GetMovieResponseBodyDto> {
    const movie = await this.movieService.getMovieById(id);

    return new GetMovieResponseBodyDto(movie);
  }

  @Get()
  @ApiOkResponse({
    description: 'Get all movies (with optional pagination)',
    type: [MovieEntity],
  })
  async getAllMovies(
    @GetUser() user,
    @Query() query: GetAllMoviesequestQuery,
  ): Promise<GetMoviesResponseBodyDto> {
    const { page, take } = query;

    const { movies, count } = await this.movieService.getAllMovies(
      user.id,
      query,
    );

    return new GetMoviesResponseBodyDto({
      metadata: { itemsAmount: count, page, take },
      movies: movies,
    });
  }
}
