/* eslint-disable prettier/prettier */
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FriendshiptDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'userId',
    example: 123,
  })
  userId: number;

  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'userId2',
    example: 123,
  })
  userId2: number;
}
