import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({
    description: 'The JWT auth token',
  })
  @IsNotEmpty({ message: 'Access token cannot be empty' })
  @IsString({ message: 'Access token should be of type string' })
  access_token: string;
}
