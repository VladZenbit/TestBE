import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

import { SALT_LENGTH } from 'src/common/constants';

import { UserProfileDto } from '../users/dto/user-profile.dto';
import { UsersService } from '../users/users.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { SignInUserRequestBodyDto } from './dto/sign-in-user.dto';
import { PasswordIsNotValidException } from './exceptions/password-is-not-valid.exception';
import { UserWithEmailAlreadyExistException } from './exceptions/user-with-email-already-exist.exception';
import { UserWithThisEmailNotFoundException } from './exceptions/user-with-this-email-not-found.exception';
import { SignInPayload } from './types/sign-in-payload';
import { SignUpPayload } from './types/sign-up-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async authorizeUser(
    userData: SignInUserRequestBodyDto,
  ): Promise<UserProfileDto> {
    const user = await this.usersService.findByEmail(userData.email);

    if (!user) {
      throw new UserWithThisEmailNotFoundException(userData.email);
    }

    const isMatch: boolean = bcrypt.compareSync(
      userData.password,
      user.passwordHash,
    );

    if (!isMatch) {
      throw new PasswordIsNotValidException();
    }

    const { passwordHash: userPassword, ...userProfile } = user;

    return userProfile;
  }

  async signUpUser(signUpUserDto: SignUpPayload): Promise<AccessTokenDto> {
    const existingUser = await this.usersService.findByEmail(
      signUpUserDto.email,
    );

    if (existingUser) {
      throw new UserWithEmailAlreadyExistException(signUpUserDto.email);
    }

    const passwordHash = await bcrypt.hash(signUpUserDto.password, SALT_LENGTH);

    const createdUser = await this.usersService.createOne({
      ...signUpUserDto,
      passwordHash,
    });

    return this.singInUserWithJWT(createdUser);
  }

  async singInUserWithJWT(user: UserProfileDto, rememberMe?: boolean): Promise<AccessTokenDto> {
    const userProfile: UserProfileDto = {
      email: user.email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const shortLived = this.configService.get<number>('ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC');
    const longLived = this.configService.get<number>('ACCESS_TOKEN_REMEMBER_ME_VALIDITY_DURATION_IN_SEC');

    const expiresIn = rememberMe ? longLived : shortLived;

    return {
      access_token: this.jwtService.sign(userProfile, { expiresIn }),
    };
  }

  async signInUser(signInBody: SignInPayload): Promise<AccessTokenDto> {
    const user = await this.authorizeUser(signInBody);

    return this.singInUserWithJWT(user, signInBody.rememberMe);
  }
}
