import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dtos/create-place.dto';
import { Place } from '@prisma/client';
import { ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Places')
@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @ApiQuery({
    name: 'userId',
    type: String,
    description: 'A parameter. Optional',
    required: false,
  })
  @Get()
  async getPlaces(@Query('userId') userId?: string): Promise<Place[]> {
    return this.placeService.getPlaces(userId);
  }

  @Post()
  async insertPlace(@Body() createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placeService.insertPlace(createPlaceDto);
  }
}
