import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UserWithIdNotFoundException } from '../auth/exceptions/user-with-id-not-found-exception';
import { UserProfileDto } from './dto/user-profile.dto';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('getUserInfo', () => {
    it('should return user profile if user exists', async () => {
      const userId = 'userId';
      const mockUser = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };
      const expectedUserProfileDto: UserProfileDto = {
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
      };

      usersRepository.findById = jest.fn().mockResolvedValue(mockUser);

      const result = await usersService.getUserInfo(userId);

      expect(usersRepository.findById).toHaveBeenCalledWith(userId);

      expect(result).toEqual(expectedUserProfileDto);
    });

    it('should throw UserWithIdNotFoundException if user not found', async () => {
      const userId = 'nonexistentUserId';

      usersRepository.findById = jest.fn().mockResolvedValue(null);

      await expect(usersService.getUserInfo(userId)).rejects.toThrowError(UserWithIdNotFoundException);
    });
  });
});
