/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    name: 'email',
    example: 'bruno123gamer',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    name: 'code',
    example: '123456',
  })
  code: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    name: 'newPassword',
    example: '12345678',
  })
  newPassword: string;

}
