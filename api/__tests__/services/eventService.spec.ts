import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from '../../src/modules/event/event.service';
import { EventRepository } from '../../src/modules/event/event.repository';
import { PlaceService } from '../../src/modules/place/place.service';
import { EmailService } from '../../src/modules/email/email.service';
import { CreateEventDto } from '../../src/modules/event/dtos/create-event.dto';
import { RegisterPresenceDto } from '../../src/modules/event/dtos/register-presence.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Event } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { getValidCreateEvenDto, getValidEvent, getValidPlace, getValidUser } from '__tests__/__util__/validObjects';

const mockEventRepositoryGetUserEvents = jest.fn();
const mockEventRepositoryRegisterPresence = jest.fn();
const mockEventRepositoryRemoveAttendance = jest.fn();
const mockEventRepositoryGet = jest.fn();
const mockEventRepositoryInsert = jest.fn();
const mockPlaceServiceGetById = jest.fn();
const mockPlaceServiceGetAllUsersThatFavourited = jest.fn();
const mockEmailServiceSendEventMail = jest.fn();

const mockPrismaService = {};

jest.mock('elastic-apm-node', () => ({
  start: jest.fn(),
}));

jest.mock('../../src/config/winston.config', () => {
  const originalModule = jest.requireActual('../../src/config/winston.config');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      ...originalModule.default,
      info: jest.fn(),
      error: jest.fn(),
    },
  };
});

jest.mock('@elastic/elasticsearch', () => {
  return {
    Client: jest.fn().mockImplementation(() => ({
      search: jest.fn(),
      index: jest.fn(),
    })),
  };
});

jest.mock('winston-elasticsearch', () => {
  return {
    ElasticsearchTransport: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      log: jest.fn().mockImplementation((info, callback) => {
        callback(null, true);
      }),
    })),
  };
});

jest.mock('../../src/modules/event/event.repository', () => ({
  EventRepository: jest.fn().mockImplementation(() => ({
    getUserEvents: mockEventRepositoryGetUserEvents,
    registerPresence: mockEventRepositoryRegisterPresence,
    removeAttendance: mockEventRepositoryRemoveAttendance,
    getEvents: mockEventRepositoryGet,
    insertEvent: mockEventRepositoryInsert,
  })),
}));

jest.mock('../../src/modules/place/place.service', () => ({
  PlaceService: jest.fn().mockImplementation(() => ({
    getPlaceById: mockPlaceServiceGetById,
    getAllUsersThatFavourited: mockPlaceServiceGetAllUsersThatFavourited,
  })),
}));

jest.mock('../../src/modules/email/email.service', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendEventMail: mockEmailServiceSendEventMail,
  })),
}));

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: EventRepository, useClass: EventRepository },
        { provide: PlaceService, useClass: PlaceService },
        { provide: EmailService, useClass: EmailService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    eventService = module.get<EventService>(EventService);
  });

  describe('getEvents', () => {
    it('given existing events, when getEvents is called, then it should return list of events', async () => {
      const mockEvents = [
        getValidEvent(),
        getValidEvent(),
      ];

      mockEventRepositoryGet.mockResolvedValue(mockEvents);

      const result = await eventService.getEvents();

      expect(result).toEqual(mockEvents);
      expect(mockEventRepositoryGet).toHaveBeenCalledTimes(1);
    });

    it('given no events, when getEvents is called, then it should return an empty list', async () => {
      mockEventRepositoryGet.mockResolvedValue([]);

      const result = await eventService.getEvents();

      expect(result).toEqual([]);
      expect(mockEventRepositoryGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('insertEvent', () => {
    it('given non-existing placeId, when insertEvent is called, then it should throw NotFoundException', async () => {
      const createEventDto: CreateEventDto = getValidCreateEvenDto();

      mockPlaceServiceGetById.mockRejectedValue(new NotFoundException('Place not found'));

      await expect(eventService.insertEvent(createEventDto)).rejects.toThrow(NotFoundException);
      expect(mockPlaceServiceGetById).toHaveBeenCalledWith(createEventDto.placeId);
      expect(mockPlaceServiceGetById).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryInsert).toHaveBeenCalledTimes(0);
    });

    it('given valid event data, when insertEvent is called, then it should insert and return the new event', async () => {
      const createEventDto: CreateEventDto = getValidCreateEvenDto();
      const mockEvent = getValidEvent();
      const mockPlace = getValidPlace();
      const mockUsers = [getValidUser(), getValidUser()];

      mockEventRepositoryInsert.mockResolvedValue(mockEvent);
      mockPlaceServiceGetById.mockResolvedValue(mockPlace);
      mockPlaceServiceGetAllUsersThatFavourited.mockResolvedValue(mockUsers);

      const result = await eventService.insertEvent(createEventDto);

      expect(result).toEqual(mockEvent);
      expect(mockPlaceServiceGetById).toHaveBeenCalledWith(createEventDto.placeId);
      expect(mockPlaceServiceGetById).toHaveBeenCalledTimes(1);
      expect(mockPlaceServiceGetAllUsersThatFavourited).toHaveBeenCalledWith(createEventDto.placeId);
      expect(mockPlaceServiceGetAllUsersThatFavourited).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryInsert).toHaveBeenCalledWith(createEventDto);
      expect(mockEventRepositoryInsert).toHaveBeenCalledTimes(1);

      mockUsers.forEach(user => {
        expect(mockEmailServiceSendEventMail).toHaveBeenCalledWith(user.email, createEventDto.name, mockPlace.name);
      });
      expect(mockEmailServiceSendEventMail).toHaveBeenCalledTimes(mockUsers.length);
    });
  });

  describe('toggleRegisterPresence', () => {
    it('given user is already registered for the event, when toggleRegisterPresence is called, then it should remove attendance', async () => {
      const registerPresenceDto: RegisterPresenceDto = { userId: 1, eventId: 1 };
      const mockEvents: Event[] = [{ id: 1 } as Event];

      mockEventRepositoryGetUserEvents.mockResolvedValue(mockEvents);

      await eventService.toggleRegisterPresence(registerPresenceDto);

      expect(mockEventRepositoryGetUserEvents).toHaveBeenCalledWith(registerPresenceDto.userId);
      expect(mockEventRepositoryGetUserEvents).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryRemoveAttendance).toHaveBeenCalledWith(registerPresenceDto);
      expect(mockEventRepositoryRemoveAttendance).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryRegisterPresence).toHaveBeenCalledTimes(0);
    });

    it('given user is not registered for the event, when toggleRegisterPresence is called, then it should register presence', async () => {
      const registerPresenceDto: RegisterPresenceDto = { userId: 1, eventId: 2 };
      const mockEvents: Event[] = [{ id: 1 } as Event];

      mockEventRepositoryGetUserEvents.mockResolvedValue(mockEvents);

      await eventService.toggleRegisterPresence(registerPresenceDto);

      expect(mockEventRepositoryGetUserEvents).toHaveBeenCalledWith(registerPresenceDto.userId);
      expect(mockEventRepositoryGetUserEvents).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryRegisterPresence).toHaveBeenCalledWith(registerPresenceDto);
      expect(mockEventRepositoryRegisterPresence).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryRemoveAttendance).toHaveBeenCalledTimes(0);
    });

    it('given no events for the user, when toggleRegisterPresence is called, then it should register presence', async () => {
      const registerPresenceDto: RegisterPresenceDto = { userId: 1, eventId: 1 };
      const mockEvents: Event[] = [];

      mockEventRepositoryGetUserEvents.mockResolvedValue(mockEvents);

      await eventService.toggleRegisterPresence(registerPresenceDto);

      expect(mockEventRepositoryGetUserEvents).toHaveBeenCalledWith(registerPresenceDto.userId);
      expect(mockEventRepositoryGetUserEvents).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryRegisterPresence).toHaveBeenCalledWith(registerPresenceDto);
      expect(mockEventRepositoryRegisterPresence).toHaveBeenCalledTimes(1);
      expect(mockEventRepositoryRemoveAttendance).toHaveBeenCalledTimes(0);
    });
  });
});
