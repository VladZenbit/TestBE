import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetSignInTokenResponseBodyDto {
  @Expose()
  @ApiProperty({ description: 'access token' })
  access_token: string;

  constructor(data: Partial<GetSignInTokenResponseBodyDto>) {
    Object.assign(this, data);
  }
}
