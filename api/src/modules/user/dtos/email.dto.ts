/* eslint-disable prettier/prettier */
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @IsEmail()
  @ApiProperty({
    type: String,
    name: 'email',
    example: 'bruno@gmail.com',
  })
  email: string;

}
