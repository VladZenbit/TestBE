import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

import { UserDto } from './user.dto';

export class UserProfileDto extends UserDto {
  @ApiProperty({
    example: '1',
    description: 'Id of the user',
  })
  @IsNotEmpty({ message: 'Id cannot be empty' })
  @IsString({ message: 'Id should be of type string' })
  id: string;
}
