import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsISO8601,
  IsInt,
  IsMilitaryTime,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateEventDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'placeId',
    example: 1,
    required: true,
  })
  placeId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    name: 'name',
    example: 'Feira de arte artesanal',
  })
  name: string;

  @IsISO8601()
  @ApiProperty({
    type: String,
    name: 'date',
    example: '2024-03-19T12:30:00Z',
    required: true,
  })
  date: string;

  @ValidateIf((o) => !o.fullDay)
  @IsMilitaryTime()
  @ApiProperty({
    type: String,
    name: 'duration',
    example: '02:00',
    required: false,
  })
  duration: string;

  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    name: 'fullDay',
    example: false,
    required: false,
  })
  fullDay = false;
}
