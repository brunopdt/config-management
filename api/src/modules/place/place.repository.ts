import { Injectable } from '@nestjs/common';
import { Place } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePlaceDto } from './dtos/create-place.dto';

@Injectable()
export class PlaceRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getPlaces(userId?: string): Promise<Place[]> {
    const queryResult = await this.prisma.place.findMany({
      include: {
        userPlace: true,
        _count: {
          select: { userPlace: true },
        },        
      },
      orderBy: {
        userPlace: {
          _count: 'desc',
        },
      }
    });

    return queryResult.map((place) => ({
      ...place,
      favouriteCount: place._count.userPlace,
      favourite: userId
        ? place.userPlace.some(
            (userPlace) => userPlace.userId === Number(userId),
          )
        : undefined,
      _count: undefined,
      userPlace: undefined,
    }));
  }

  async getPlaceById(id: number): Promise<Place> {
    return this.prisma.place.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: { userPlace: true },
        },
      },
    });
  }

  async insertPlace(createPlaceDto: CreatePlaceDto): Promise<Place> {
    return this.prisma.place.create({
      data: createPlaceDto,
    });
  }

  async getAllUsersThatFavourited(id: number) {
    const userPlaces = await this.prisma.userPlace.findMany({
      where: {
        placeId: id,
      },
    });

    const userIds = userPlaces.map((userPlace) => userPlace.userId);

    return this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });
  }
}
