import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../../src/modules/dashboard/dashboard.service';
import { DashboardRepository } from '../../src/modules/dashboard/dashboard.repository';
import { PlaceService } from '../../src/modules/place/place.service';
import { EventService } from '../../src/modules/event/event.service';
import { DashboardDto } from '../../src/modules/dashboard/dtos/dashboard.dto';
import { faker } from '@faker-js/faker';
import { getValidEvent, getValidPlace } from '__tests__/__util__/validObjects';

const mockDashboardRepositoryGetTotalUsers = jest.fn();
const mockDashboardRepositoryGetTotalEvents = jest.fn();
const mockDashboardRepositoryGetTotalPlaces = jest.fn();
const mockPlaceServiceGetPlaces = jest.fn();
const mockEventServiceGetEvents = jest.fn();

jest.mock('../../src/modules/dashboard/dashboard.repository', () => ({
  DashboardRepository: jest.fn().mockImplementation(() => ({
    getTotalUsers: mockDashboardRepositoryGetTotalUsers,
    getTotalEvents: mockDashboardRepositoryGetTotalEvents,
    getTotalPlaces: mockDashboardRepositoryGetTotalPlaces,
  })),
}));

jest.mock('../../src/modules/place/place.service', () => ({
  PlaceService: jest.fn().mockImplementation(() => ({
    getPlaces: mockPlaceServiceGetPlaces,
  })),
}));

jest.mock('../../src/modules/event/event.service', () => ({
  EventService: jest.fn().mockImplementation(() => ({
    getEvents: mockEventServiceGetEvents,
  })),
}));

describe('DashboardService', () => {
  let dashboardService: DashboardService;
  let dashboardRepository: DashboardRepository;
  let placeService: PlaceService;
  let eventService: EventService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        DashboardRepository,
        PlaceService,
        EventService
      ],
    }).compile();

    dashboardService = module.get<DashboardService>(DashboardService);
    dashboardRepository = module.get<DashboardRepository>(DashboardRepository);
    placeService = module.get<PlaceService>(PlaceService);
    eventService = module.get<EventService>(EventService);
  });

  describe('getDashboard', () => {
    it('given existing data when getDashboard is called, then it should return the correct dashboard data', async () => {
      const mockUsersCount = faker.number.int();
      const mockEventsCount = faker.number.int();
      const mockPlacesCount = faker.number.int();
      const mockPlaces = [getValidPlace(), getValidPlace()];
      const mockEvents = [getValidEvent(), getValidEvent()];

      mockDashboardRepositoryGetTotalUsers.mockResolvedValue(mockUsersCount);
      mockDashboardRepositoryGetTotalEvents.mockResolvedValue(mockEventsCount);
      mockDashboardRepositoryGetTotalPlaces.mockResolvedValue(mockPlacesCount);
      mockPlaceServiceGetPlaces.mockResolvedValue(mockPlaces);
      mockEventServiceGetEvents.mockResolvedValue(mockEvents);

      const expectedResult: DashboardDto = {
        ValueTotalUsers: mockUsersCount,
        ValueTotalEvents: mockEventsCount,
        ValueTotalPlaces: mockPlacesCount,
        top5Places: mockPlaces,
        top5Events: mockEvents
      };

      const result = await dashboardService.getDashboard();

      expect(result).toEqual(expectedResult);
      expect(mockDashboardRepositoryGetTotalUsers).toHaveBeenCalledTimes(1);
      expect(mockDashboardRepositoryGetTotalEvents).toHaveBeenCalledTimes(1);
      expect(mockDashboardRepositoryGetTotalPlaces).toHaveBeenCalledTimes(1);
      expect(mockPlaceServiceGetPlaces).toHaveBeenCalledTimes(1);
      expect(mockEventServiceGetEvents).toHaveBeenCalledTimes(1);
    });

    it('given no places, when getDashboard is called, then it should return the correct dashboard data with an empty top5Places', async () => {
      const mockUsersCount = faker.number.int();
      const mockEventsCount = faker.number.int();
      const mockPlacesCount = faker.number.int();
      const mockPlaces = [];
      const mockEvents = [getValidEvent(), getValidEvent()];

      mockDashboardRepositoryGetTotalUsers.mockResolvedValue(mockUsersCount);
      mockDashboardRepositoryGetTotalEvents.mockResolvedValue(mockEventsCount);
      mockDashboardRepositoryGetTotalPlaces.mockResolvedValue(mockPlacesCount);
      mockPlaceServiceGetPlaces.mockResolvedValue(mockPlaces);
      mockEventServiceGetEvents.mockResolvedValue(mockEvents);

      const expectedResult: DashboardDto = {
        ValueTotalUsers: mockUsersCount,
        ValueTotalEvents: mockEventsCount,
        ValueTotalPlaces: mockPlacesCount,
        top5Places: mockPlaces,
        top5Events: mockEvents
      };

      const result = await dashboardService.getDashboard();

      expect(result).toEqual(expectedResult);
      expect(mockDashboardRepositoryGetTotalUsers).toHaveBeenCalledTimes(1);
      expect(mockDashboardRepositoryGetTotalEvents).toHaveBeenCalledTimes(1);
      expect(mockDashboardRepositoryGetTotalPlaces).toHaveBeenCalledTimes(1);
      expect(mockPlaceServiceGetPlaces).toHaveBeenCalledTimes(1);
      expect(mockEventServiceGetEvents).toHaveBeenCalledTimes(1);
    });

    it('given no events, when getDashboard is called, then it should return the correct dashboard data with an empty top5Events', async () => {
      const mockUsersCount = faker.number.int();
      const mockEventsCount = faker.number.int();
      const mockPlacesCount = faker.number.int();
      const mockPlaces = [getValidPlace(), getValidPlace()];
      const mockEvents = []

      mockDashboardRepositoryGetTotalUsers.mockResolvedValue(mockUsersCount);
      mockDashboardRepositoryGetTotalEvents.mockResolvedValue(mockEventsCount);
      mockDashboardRepositoryGetTotalPlaces.mockResolvedValue(mockPlacesCount);
      mockPlaceServiceGetPlaces.mockResolvedValue(mockPlaces);
      mockEventServiceGetEvents.mockResolvedValue(mockEvents);

      const expectedResult: DashboardDto = {
        ValueTotalUsers: mockUsersCount,
        ValueTotalEvents: mockEventsCount,
        ValueTotalPlaces: mockPlacesCount,
        top5Places: mockPlaces,
        top5Events: mockEvents
      };

      const result = await dashboardService.getDashboard();

      expect(result).toEqual(expectedResult);
      expect(mockDashboardRepositoryGetTotalUsers).toHaveBeenCalledTimes(1);
      expect(mockDashboardRepositoryGetTotalEvents).toHaveBeenCalledTimes(1);
      expect(mockDashboardRepositoryGetTotalPlaces).toHaveBeenCalledTimes(1);
      expect(mockPlaceServiceGetPlaces).toHaveBeenCalledTimes(1);
      expect(mockEventServiceGetEvents).toHaveBeenCalledTimes(1);
    });
  });
});
