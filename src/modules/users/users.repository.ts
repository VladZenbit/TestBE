import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findAll(): Promise<UserEntity[]> {
    return this.find();
  }

  async findById(id: string): Promise<UserEntity> {
    return this.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.findOne({ where: { email } });
  }

  async createOne(
    payload: Pick<
      UserEntity,
      'firstName' | 'lastName' | 'email' | 'passwordHash'
    >,
  ): Promise<UserEntity> {
    const { firstName, lastName, email, passwordHash } = payload;

    const user = this.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    await this.save(user);

    return user;
  }
}
