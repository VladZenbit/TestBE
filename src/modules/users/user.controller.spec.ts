import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserWithIdNotFoundException } from '../auth/exceptions/user-with-id-not-found-exception';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUserInfo: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getMe', () => {
    it('should return user profile info if user exists', async () => {
      const mockUser = { id: 'userId', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
      const mockUserProfileDto: UserProfileDto = {
        id: 'userId',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      };

      usersService.getUserInfo = jest.fn().mockResolvedValue(mockUserProfileDto);

      const result = await usersController.getMe(mockUser);

      expect(usersService.getUserInfo).toHaveBeenCalledWith(mockUser.id);

      expect(result).toEqual(mockUserProfileDto);
    });

    it('should throw UserWithIdNotFoundException if user not found', async () => {
      const mockUser = { id: 'nonexistentUserId' };

      usersService.getUserInfo = jest.fn().mockRejectedValue(new UserWithIdNotFoundException(mockUser.id));

      await expect(usersController.getMe(mockUser)).rejects.toThrowError(UserWithIdNotFoundException);
    });
  });
});
