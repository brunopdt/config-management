/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAdminDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    name: 'username',
    example: 'bruno@gmail.com',
  })
  username: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    name: 'password',
    example: '12345678',
  })
  password: string;

}
