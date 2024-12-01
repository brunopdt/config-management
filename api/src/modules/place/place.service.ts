import { Injectable, NotFoundException } from '@nestjs/common';
import { PlaceRepository } from './place.repository';
import { Place } from '@prisma/client';
import { CreatePlaceDto } from './dtos/create-place.dto';

@Injectable()
export class PlaceService {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async getPlaces(userId?: string): Promise<Place[]> {
    return this.placeRepository.getPlaces(userId);
  }

  async getPlaceById(id: number): Promise<Place> {
    const placeFound = await this.placeRepository.getPlaceById(id);

    if (placeFound) return placeFound;

    throw new NotFoundException('Local não encontrado');
  }

  async insertPlace(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.placeRepository.insertPlace(createPlaceDto);
  }

  async getAllUsersThatFavourited(id: number) {
    return this.placeRepository.getAllUsersThatFavourited(id);
  }
}
