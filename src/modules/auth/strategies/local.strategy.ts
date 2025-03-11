import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserProfileDto } from 'src/modules/users/dto/user-profile.dto';

import { AuthService } from '../auth.service';
import { EmailOrPasswordIsNotValidException } from '../exceptions/email-or-password-is-not-valid.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserProfileDto> {
    try {
      const user = await this.authService.authorizeUser({ email, password });

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      throw new EmailOrPasswordIsNotValidException();
    }
  }
}
