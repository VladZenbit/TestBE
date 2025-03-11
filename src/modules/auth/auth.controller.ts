import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ApiNamedException } from 'src/common/decorators/named-api-exception.decorator';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorators';
import { AccessTokenDto } from './dto/access-token.dto';
import { GetSignInTokenResponseBodyDto } from './dto/get-sign-token-response-body-dto';
import { GetSignUpTokenResponseBodyDto } from './dto/get-sign-up-token-response-body-dto';
import { SignInUserRequestBodyDto } from './dto/sign-in-user.dto';
import { SignUpUserRequestBodyDto } from './dto/sign-up-user-request-body.dto';
import { userWithEmailAlreadyExistExceptionsSample } from './exceptions/user-with-email-already-exist.exception';
import { userWithEmailNotFoundExceptionSample } from './exceptions/user-with-this-email-not-found.exception';

@Public()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @ApiOkResponse({
    description: 'Sign in user',
    type: SignInUserRequestBodyDto,
  })
  @ApiNamedException(() => [userWithEmailNotFoundExceptionSample])
  async signInUser(
    @Body() signInBody: SignInUserRequestBodyDto,
  ): Promise<GetSignInTokenResponseBodyDto> {
    const token = await this.authService.signInUser(signInBody);

    return new GetSignInTokenResponseBodyDto(token);
  }

  @Post('sign-up')
  @ApiOkResponse({ description: 'Sign up user', type: AccessTokenDto })
  @ApiNamedException(() => [userWithEmailAlreadyExistExceptionsSample])
  async register(
    @Body() registerBody: SignUpUserRequestBodyDto,
  ): Promise<AccessTokenDto> {
    const token = await this.authService.signUpUser(registerBody);

    return new GetSignUpTokenResponseBodyDto(token);
  }
}
