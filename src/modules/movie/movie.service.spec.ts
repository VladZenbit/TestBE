import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovieEntity, UserEntity } from 'src/entities';
import { StorageService } from '../storage/storage.service';
import { CreateMoviePayload } from './types/create-movie-payload';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Repository<MovieEntity>;
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(MovieEntity),
          useClass: Repository,
        },
        {
          provide: StorageService,
          useValue: {
            upload: jest.fn().mockResolvedValue('imageUrl'),
            getSignedUrl: jest.fn().mockResolvedValue('signedUrl'),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<MovieEntity>>(getRepositoryToken(MovieEntity));
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
  });

  describe('createMovie', () => {
    it('should create a movie successfully', async () => {
      const createMovieDto: CreateMoviePayload = {
        name: 'Test Movie',
        description: 'Test Description',
        movieImage: {
          fieldname: 'movieImage',
          originalname: 'testImage.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('test'),
          size: 1234,
          stream: null,
          destination: '',
          filename: 'testImage.jpg',
          path: '',
        },
      };

      const user: UserEntity = {
        id: 'userId',
        email: 'user@test.com',
        movies: [],
      } as UserEntity;

      const movie = new MovieEntity();
      movie.id = 'movieId';
      movie.name = createMovieDto.name;
      movie.description = createMovieDto.description;
      movie.imageUrl = 'imageUrl';
      movie.user = user;
      movie.createdAt = new Date();
      movie.updatedAt = new Date();

      jest.spyOn(movieRepository, 'create').mockReturnValue(movie);

      jest.spyOn(movieRepository, 'save').mockResolvedValue(movie);

      const result = await movieService.createMovie(createMovieDto, user);

      expect(result).toEqual(movie);
      expect(storageService.upload).toHaveBeenCalledWith({
        file: createMovieDto.movieImage.buffer,
        filePath: `movie/${user.id}${createMovieDto.movieImage.originalname}`,
        preserveFileName: true,
      });
      expect(movieRepository.create).toHaveBeenCalledWith({
        ...createMovieDto,
        user,
        imageUrl: 'imageUrl',
      });
      expect(movieRepository.save).toHaveBeenCalledWith(movie);
    });
  });

  describe('getMovieById', () => {
    it('should return a movie with a signed URL', async () => {
      const movieId = 'movieId';
      const user: UserEntity = {
        id: 'userId',
        email: 'user@test.com',
        movies: [],
      } as UserEntity;

      const movie = new MovieEntity();
      movie.id = movieId;
      movie.name = 'Test Movie';
      movie.description = 'Test Description';
      movie.imageUrl = 'movieImageUrl';
      movie.user = user;
      movie.createdAt = new Date();
      movie.updatedAt = new Date();

      jest.spyOn(movieRepository, 'findOneOrFail').mockResolvedValue(movie);

      const result = await movieService.getMovieById(movieId);

      expect(result).toEqual({
        ...movie,
        imageUrl: 'signedUrl',
      });

      expect(movieRepository.findOneOrFail).toHaveBeenCalledWith({ where: { id: movieId } });

      expect(storageService.getSignedUrl).toHaveBeenCalledWith(movie.imageUrl);
    });
  });

  describe('getAllMovies', () => {
    it('should return all movies with signed URLs', async () => {
      const userId = 'userId';

      const movies = [
        new MovieEntity(),
        new MovieEntity(),
      ];

      movies[0].id = 'movieId1';
      movies[0].name = 'Movie 1';
      movies[0].imageUrl = 'imageUrl1';
      movies[0].user = { id: userId } as UserEntity;

      movies[1].id = 'movieId2';
      movies[1].name = 'Movie 2';
      movies[1].imageUrl = 'imageUrl2';
      movies[1].user = { id: userId } as UserEntity;

      jest.spyOn(movieRepository, 'findAndCount').mockResolvedValue([movies, 2]);

      const result = await movieService.getAllMovies(userId, { skip: 0, take: 10 });

      expect(movieRepository.findAndCount).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        skip: 0,
        take: 10,
      });

      expect(storageService.getSignedUrl).toHaveBeenCalledWith('imageUrl1');
      expect(storageService.getSignedUrl).toHaveBeenCalledWith('imageUrl2');

      expect(result).toEqual({
        movies: [
          { ...movies[0], imageUrl: 'signedUrl' },
          { ...movies[1], imageUrl: 'signedUrl' },
        ],
        count: 2,
      });
    });
  });
  describe('updateMovie', () => {
    it('should update movie successfully', async () => {
      const userId = 'userId';
      const movieId = 'movieId';

      const updateMovieDto = {
        name: 'Updated Movie',
        description: 'Updated Description',
        movieImage: {
          fieldname: 'movieImage',
          originalname: 'newImage.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          size: 12345,
          buffer: Buffer.from('test'),
          stream: null,
          destination: '',
          filename: 'testImage.jpg',
          path: '',
        },
      };

      const existingMovie = new MovieEntity();
      existingMovie.id = movieId;
      existingMovie.name = 'Old Movie';
      existingMovie.description = 'Old Description';
      existingMovie.imageUrl = 'oldImageUrl';
      existingMovie.user = { id: userId } as UserEntity;

      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(existingMovie);

      jest.spyOn(movieRepository, 'save').mockResolvedValue(existingMovie);

      jest.spyOn(storageService, 'delete').mockResolvedValue(undefined);

      jest.spyOn(storageService, 'upload').mockResolvedValue('newImageUrl');

      const userProfileDto = {
        id: 'userId',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await movieService.updateMovie(movieId, updateMovieDto, userProfileDto);

      expect(movieRepository.findOneBy).toHaveBeenCalledWith({ id: movieId });

      expect(storageService.delete).toHaveBeenCalledWith('oldImageUrl');

      expect(storageService.upload).toHaveBeenCalledWith({
        file: updateMovieDto.movieImage.buffer,
        filePath: `movie/${userProfileDto.id}newImage.jpg`,
        preserveFileName: true,
      });

      expect(movieRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Updated Movie',
        description: 'Updated Description',
        imageUrl: 'newImageUrl',
      }));

      expect(result).toEqual(existingMovie);
    });
  });
});
