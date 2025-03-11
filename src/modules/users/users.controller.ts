import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiNamedException } from 'src/common/decorators/named-api-exception.decorator';

import { userWithIdNotFoundExceptionSample } from '../auth/exceptions/user-with-id-not-found-exception';

import { GetUser } from './decorators/get-user.decorators';
import { UserProfileDto } from './dto/user-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  private readonly usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get('me')
  @ApiNamedException(() => [userWithIdNotFoundExceptionSample])
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully.',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  async getMe(@GetUser() user): Promise<UserProfileDto> {
    return this.usersService.getUserInfo(user.id);
  }
}
