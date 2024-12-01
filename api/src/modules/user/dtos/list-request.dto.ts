/* eslint-disable prettier/prettier */
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListRequestDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'userId',
    example: '123',
  })
  userId: number;
}
