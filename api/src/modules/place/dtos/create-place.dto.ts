import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    name: 'name',
    example: 'Major Lock',
  })
  name: string;

  @IsNotEmpty()
  @IsLatitude()
  @ApiProperty({
    type: Number,
    name: 'latitude',
    example: '45.90000',
  })
  latitude: number;

  @IsNotEmpty()
  @IsLongitude()
  @ApiProperty({
    type: Number,
    name: 'longitude',
    example: '45.90000',
  })
  longitude: number;
}
