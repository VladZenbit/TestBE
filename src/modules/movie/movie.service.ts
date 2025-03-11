import { extname } from 'path';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity, UserEntity } from 'src/entities';
import { Repository } from 'typeorm';

import { StorageService } from '../storage/storage.service';
import { UserProfileDto } from '../users/dto/user-profile.dto';

import { MovieNotFoundException } from './exception/user-with-email-already-exist.exception';
import { CreateMoviePayload } from './types/create-movie-payload';
import { UpdateMoviePayload } from './types/update-movie-payload';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    private readonly storageService: StorageService,
  ) {}

  async createMovie(
    createMovieDto: CreateMoviePayload,
    user: UserProfileDto,
  ): Promise<MovieEntity> {
    const { movieImage } = createMovieDto;

    const imageUrl = await this.storageService.upload({
      file: movieImage.buffer,
      filePath: `movie/${user.id}${movieImage.originalname}`,
      preserveFileName: true,
    });

    const movie = this.movieRepository.create({
      ...createMovieDto,
      user,
      imageUrl: imageUrl,
    });

    return this.movieRepository.save(movie);
  }

  async updateMovie(
    id: string,
    updateMovieDto: UpdateMoviePayload,
    user: UserProfileDto,
  ): Promise<MovieEntity> {
    const { movieImage } = updateMovieDto;
    const movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      throw new MovieNotFoundException(id);
    }

    if (movieImage) {
      if (movie.imageUrl) {
        await this.storageService.delete(movie.imageUrl);
      }

      const imageUrl = await this.storageService.upload({
        file: movieImage.buffer,
        filePath: `movie/${user.id}${movieImage.originalname}`,
        preserveFileName: true,
      });

      movie.imageUrl = imageUrl;
    }
    Object.assign(movie, updateMovieDto);

    return this.movieRepository.save(movie);
  }

  async getMovieById(id: string): Promise<MovieEntity> {
    const movie = await this.movieRepository.findOneOrFail({ where: { id } });

    const signedUrl = await this.storageService.getSignedUrl(movie.imageUrl);

    return { ...movie, imageUrl: signedUrl };
  }

  async getAllMovies(
    userId: string,
    options: { skip?: number; take?: number },
  ): Promise<{ movies: MovieEntity[]; count: number }> {
    const { skip, take } = options;

    const [movies, count] = await this.movieRepository.findAndCount({
      where: { user: { id: userId } },
      skip,
      take,
    });

    const moviesWithSignedUrls = await Promise.all(
      movies.map(async (movie) => {

        const signedUrl = await this.storageService.getSignedUrl(movie.imageUrl);
        return { ...movie, imageUrl: signedUrl };
      }),
    );

    return { movies: moviesWithSignedUrls, count };
  }
}
