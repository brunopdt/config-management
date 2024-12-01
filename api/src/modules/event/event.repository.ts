import { Injectable } from '@nestjs/common';
import { Event } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { RegisterPresenceDto } from './dtos/register-presence.dto';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) { }

  async getEvents(userId?: number): Promise<Event[]> {
    const queryResult = await this.prisma.event.findMany({
      include: {
        userEvent: true,
        _count: {
          select: { userEvent: true },
        },
        Place: true,
      },
      orderBy: {
        userEvent: {
          _count: 'desc',
        },
      }
    });

    return queryResult.map((place) => ({
      ...place,
      favouriteCount: place._count.userEvent,
      favourite: userId
        ? place.userEvent.some(
          (userPlace) => userPlace.userId === Number(userId),
        )
        : undefined,
      _count: undefined,
      userPlace: undefined,
    }));
  }

  async insertEvent(createEventDto: CreateEventDto): Promise<Event> {
    return this.prisma.event.create({
      data: createEventDto,
    });
  }

  async registerPresence(registerPresenceDto: RegisterPresenceDto) {
    return this.prisma.userEvent.create({
      data: registerPresenceDto,
    });
  }

  async removeAttendance(registerPresenceDto: RegisterPresenceDto) {
    return this.prisma.userEvent.deleteMany({
      where: {
        eventId: registerPresenceDto.eventId,
        userId: registerPresenceDto.userId,
      },
    });
  }

  async getUserEvents(userId: number): Promise<Event[]> {
    const queryResult = await this.prisma.userEvent.findMany({
      where: {
        userId: userId,
      },
      select: {
        Event: {
          include: {
            _count: {
              select: { userEvent: true },
            },
          },
        },
      },
      distinct: 'eventId',
    });

    return queryResult.map((event) => event.Event);
  }
}
