import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';

import { CreateMovieResponseBodyDto } from './dto/create-movie-response-body-dto';
import { GetMovieResponseBodyDto } from './dto/get-movie-response-body-dto';
import { GetAllMoviesequestQuery } from './dto/get-all-movies-request.dto';
import { MovieEntity } from 'src/entities';
import { UserProfileDto } from '../users/dto/user-profile.dto';
import { UpdateMovieResponseBodyDto } from './dto/update-movie-response-body-dto.dto';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            createMovie: jest.fn().mockResolvedValue({ id: 'movieId', name: 'Test Movie' }),
            getMovieById: jest.fn().mockResolvedValue({ id: 'movieId', name: 'Test Movie' }),
            getAllMovies: jest.fn().mockResolvedValue({
              movies: [{ id: 'movieId', name: 'Test Movie' }],
              count: 1,
            }),
            updateMovie: jest.fn(),
          },
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  it('should create a movie successfully', async () => {
    const mockUser = { id: 'userId', email: 'user@example.com' };
    const mockMovieImage: Express.Multer.File = {
      fieldname: 'movieImage',
      originalname: 'testImage.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 12345,
      buffer: Buffer.from('test'),
      stream: null,
      destination: '',
      filename: 'testImage.jpg',
      path: '',
    };

    const createMovieDto: CreateMovieResponseBodyDto = {
      name: 'New Movie',
      description: 'Movie description',
      movieImage: mockMovieImage,
    };

    const result = await movieController.createMovie(mockUser, createMovieDto, mockMovieImage);

    expect(movieService.createMovie).toHaveBeenCalledWith(createMovieDto, mockUser);

    expect(result).toEqual(new GetMovieResponseBodyDto({ id: 'movieId', name: 'Test Movie' }));
  });

  describe('getMovieById', () => {
    it('should return a movie by ID', async () => {
      const movieId = 'movieId';

      const result = await movieController.getMovieById(movieId);

      expect(movieService.getMovieById).toHaveBeenCalledWith(movieId);

      expect(result).toEqual(new GetMovieResponseBodyDto({ id: 'movieId', name: 'Test Movie' }));
    });
  });

  describe('getAllMovies', () => {
    it('should return a paginated list of movies', async () => {
      const mockUser = { id: 'userId', email: 'user@example.com' };
      const query: GetAllMoviesequestQuery = {
        page: 1, take: 10,
        skip: 0
      };

      const result = await movieController.getAllMovies(mockUser, query);

      expect(movieService.getAllMovies).toHaveBeenCalledWith(mockUser.id, query);
    });
  });

  describe('updateMovie', () => {
    it('should update a movie and return the updated movie data', async () => {
      const mockUser: UserProfileDto = {
        id: 'userId', email: 'user@example.com',
        firstName: '',
        lastName: ''
      };
      const movieId = 'movieId';
      const updateMovieDto: UpdateMovieResponseBodyDto = {
        name: 'Updated Movie',
        description: 'Updated description',
      };

      const mockUpdatedMovie = new MovieEntity();
      mockUpdatedMovie.id = movieId;
      mockUpdatedMovie.name = 'Updated Movie';
      mockUpdatedMovie.description = 'Updated description';
      mockUpdatedMovie.imageUrl = 'updated-image-url';
      mockUpdatedMovie.createdAt = new Date();
      mockUpdatedMovie.updatedAt = new Date();

      movieService.updateMovie = jest.fn().mockResolvedValue(mockUpdatedMovie);

      const result = await movieController.updateMovie(mockUser, movieId, updateMovieDto, undefined);

      expect(movieService.updateMovie).toHaveBeenCalledWith(
        movieId,
        updateMovieDto,
        mockUser,
      );

      expect(result).toEqual(new GetMovieResponseBodyDto(mockUpdatedMovie));
    });

    it('should update a movie with an image and return the updated movie data', async () => {
      const mockUser: UserProfileDto = {
        id: 'userId', email: 'user@example.com',
        firstName: '',
        lastName: ''
      };
      const movieId = 'movieId';
      const updateMovieDto: UpdateMovieResponseBodyDto = {
        name: 'Updated Movie with Image',
        description: 'Updated description with image',
      };

      const mockUpdatedMovie = new MovieEntity();
      mockUpdatedMovie.id = movieId;
      mockUpdatedMovie.name = 'Updated Movie with Image';
      mockUpdatedMovie.description = 'Updated description with image';
      mockUpdatedMovie.imageUrl = 'updated-image-url';
      mockUpdatedMovie.createdAt = new Date();
      mockUpdatedMovie.updatedAt = new Date();

      const mockImage: Express.Multer.File = {
        filename: 'image.png', path: 'path/to/image.png',
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: '',
        size: 0,
        stream: null,
        destination: '',
        buffer: undefined
      };

      movieService.updateMovie = jest.fn().mockResolvedValue(mockUpdatedMovie);

      const result = await movieController.updateMovie(mockUser, movieId, updateMovieDto, mockImage);

      expect(movieService.updateMovie).toHaveBeenCalledWith(
        movieId,
        { ...updateMovieDto, movieImage: mockImage },
        mockUser,
      );

      // Проверяем, что результат соответствует ожидаемому объекту GetMovieResponseBodyDto
      expect(result).toEqual(new GetMovieResponseBodyDto(mockUpdatedMovie));
    });
  });
});
