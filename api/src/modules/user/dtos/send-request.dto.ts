/* eslint-disable prettier/prettier */
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendRequestDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'userId',
    example: '123',
  })
  userId: number;

  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'friendId',
    example: '123',
  })
  friendId: number;
}
