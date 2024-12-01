import { Injectable } from "@nestjs/common";
import { Place } from '@prisma/client';
import { User } from "@prisma/client";
import { Event } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";


@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async getTotalEvents(): Promise<number> {
    return this.prisma.event.count();
  }

  async getTotalPlaces(): Promise<number> {
    return this.prisma.place.count();
  }

  //verificar cada um 
  // async getTop5Places(): Promise<Place[]> {
  //   return this.prisma.place.findMany({
  //     take: 5,
  //     orderBy: {
  //       favouriteCount: 'desc',
  //     },
  //   });
  // }

  // async getTop5Events(): Promise<User[]> {
  //   return this.prisma.event.findMany({
  //     take: 5,
  //     orderBy: {
  //       followerCount: 'desc',
  //     },
  //   });
  // }

}