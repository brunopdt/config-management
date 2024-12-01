import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FavouritePlaceDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'userId',
    example: 6,
  })
  userId: number;

  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'placeId',
    example: 1,
  })
  placeId: number;
}
