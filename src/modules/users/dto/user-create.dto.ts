import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @ApiProperty({
    example: '********',
    description: 'Hashed password of the user',
  })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @IsString({ message: 'Password should be of type string' })
  passwordHash: string;
}
