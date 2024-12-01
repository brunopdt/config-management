import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { Event } from '@prisma/client';
import { CreateEventDto } from './dtos/create-event.dto';
import { PlaceService } from '../place/place.service';
import { EmailService } from '../email/email.service';
import logger from '../../config/winston.config';
import { RegisterPresenceDto } from './dtos/register-presence.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly placeService: PlaceService,
    private readonly emailService: EmailService,
  ) { }

  async getEvents(userId?: number): Promise<Event[]> {
    return this.eventRepository.getEvents(userId);
  }

  async insertEvent(createEventDto: CreateEventDto): Promise<Event> {
    logger.info('Iniciando a criação de um evento');

    try {
      const place = await this.placeService.getPlaceById(createEventDto.placeId);
      const users = await this.placeService.getAllUsersThatFavourited(createEventDto.placeId);

      users.forEach((user) => {
        this.emailService.sendEventMail(user.email, createEventDto.name, place.name);
      });

      const event: Event = await this.eventRepository.insertEvent(createEventDto);

      logger.info('Evento criado', { event: JSON.stringify(event) });

      return event;
    } catch (error) {
      logger.error('Erro ao criar evento', { error });
      throw error;
    }
  }

  async toggleRegisterPresence(registerPresenceDto: RegisterPresenceDto) {
    const userEvents: Event[] = await this.eventRepository.getUserEvents(
      registerPresenceDto.userId,
    );

    return userEvents
      .map((event) => event.id)
      .includes(registerPresenceDto.eventId)
      ? await this.eventRepository.removeAttendance(registerPresenceDto)
      : await this.eventRepository.registerPresence(registerPresenceDto);
  }
}
