import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities';

import { UserWithIdNotFoundException } from '../auth/exceptions/user-with-id-not-found-exception';

import { CreateUserDto } from './dto/user-create.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly usersRepository: UsersRepository;

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  async findById(id: string): Promise<UserEntity> {
    return this.usersRepository.findById(id);
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }

  async getUserInfo(userId: string): Promise<UserProfileDto> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserWithIdNotFoundException(userId);
    }

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.usersRepository.findByEmail(email);

    return user;
  }

  async createOne(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { firstName, lastName, email, passwordHash } = createUserDto;

    return this.usersRepository.createOne({
      firstName,
      lastName,
      email,
      passwordHash,
    });
  }
}
