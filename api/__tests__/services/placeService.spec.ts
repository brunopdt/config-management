import { Test, TestingModule } from '@nestjs/testing';
import { PlaceService } from '../../src/modules/place/place.service';
import { PrismaService } from 'prisma/prisma.service';
import { getValidPlace, getValidCreatePlaceDto, getValidUser } from '__tests__/__util__/validObjects';
import { PlaceRepository } from '../../src/modules/place/place.repository';
import { faker } from '@faker-js/faker';
import { CreatePlaceDto } from 'src/modules/place/dtos/create-place.dto';
import { NotFoundException } from '@nestjs/common';

const mockPlaceRepositoryGet = jest.fn();
const mockPlaceRepositoryGetPlaceById = jest.fn();
const mockPlaceRepositoryInsert = jest.fn();
const mockPlaceRepositoryGetAllUsersThatFavourited = jest.fn();

const mockPrismaService = {};

jest.mock('../../src/modules/place/place.repository', () => ({
    PlaceRepository: jest.fn().mockImplementation(() => ({
        getPlaces: mockPlaceRepositoryGet,
        getPlaceById: mockPlaceRepositoryGetPlaceById,
        insertPlace: mockPlaceRepositoryInsert,
        getAllUsersThatFavourited: mockPlaceRepositoryGetAllUsersThatFavourited,
    })),
}));

describe('PlaceService', () => {
    let placeService: PlaceService;

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PlaceService,
                { provide: PlaceRepository, useClass: PlaceRepository },
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        placeService = module.get<PlaceService>(PlaceService);
    });

    describe('getPlaces', () => {
        it('given existing places, when getPlaces is called, then it should return list of places', async () => {
            const userId = faker.word.sample();

            const mockPlaces = [
                getValidPlace(),
                getValidPlace()
            ];

            mockPlaceRepositoryGet.mockResolvedValue(mockPlaces);

            const result = await placeService.getPlaces(userId);

            expect(result).toEqual(mockPlaces);
            expect(mockPlaceRepositoryGet).toHaveBeenCalledTimes(1);
        });

        it('given no places, when getPlaces is called, then it should return an empty list', async () => {
            const userId = faker.word.sample();

            mockPlaceRepositoryGet.mockResolvedValue([]);
    
            const result = await placeService.getPlaces(userId);
    
            expect(result).toEqual([]);
            expect(mockPlaceRepositoryGet).toHaveBeenCalledTimes(1);
        });
    });

    describe('getPlaceById', () => {
        it('given existing place for the id, when getPlaceById is called, then it should return corresponding place', async () => {
            const placeId = faker.number.int();

            const mockPlace = getValidPlace();

            mockPlaceRepositoryGetPlaceById.mockResolvedValue(mockPlace);

            const result = await placeService.getPlaceById(placeId);

            expect(result).toEqual(mockPlace);
            expect(mockPlaceRepositoryGetPlaceById).toHaveBeenCalledTimes(1);
        });

        it('given a non existing place for the given id, when getPlaceById is called, then it should throw exception', async () => {
            const placeId = faker.number.int();

            mockPlaceRepositoryGetPlaceById.mockResolvedValue(undefined);

            await expect(placeService.getPlaceById(placeId)).rejects.toThrow(NotFoundException);
            expect(mockPlaceRepositoryGetPlaceById).toHaveBeenCalledTimes(1);
        });
    });

    describe('insertPlace', () => {
        it('given valid place data, when inserPlace is called, then it should insert and return the new place', async () => {
            const createPlaceDto: CreatePlaceDto = getValidCreatePlaceDto();

            const mockPlace = getValidPlace();

            mockPlaceRepositoryInsert.mockResolvedValue(mockPlace);

            const result = await placeService.insertPlace(createPlaceDto);

            expect(result).toEqual(mockPlace);
            expect(mockPlaceRepositoryInsert).toHaveBeenCalledTimes(1);
            expect(mockPlaceRepositoryInsert).toHaveBeenCalledWith(createPlaceDto);
        });
    });

    describe('getAllUsersThatFavourited', () => {
        it('given a place id, when getAllUsersThatFavourited is called, then it should return a list of users who favourited the place', async () => {
            const placeId = faker.number.int();
      
            const mockUsers = [getValidUser(), getValidUser()];
      
            mockPlaceRepositoryGetAllUsersThatFavourited.mockResolvedValue(mockUsers);
      
            const result = await placeService.getAllUsersThatFavourited(placeId);
      
            expect(result).toEqual(mockUsers);
            expect(mockPlaceRepositoryGetAllUsersThatFavourited).toHaveBeenCalledWith(placeId);
            expect(mockPlaceRepositoryGetAllUsersThatFavourited).toHaveBeenCalledTimes(1);
          });
      
          it('given a place id with no users, when getAllUsersThatFavourited is called, then it should return an empty list', async () => {
            const placeId = faker.number.int();
      
            mockPlaceRepositoryGetAllUsersThatFavourited.mockResolvedValue([]);
      
            const result = await placeService.getAllUsersThatFavourited(placeId);
      
            expect(result).toEqual([]);
            expect(mockPlaceRepositoryGetAllUsersThatFavourited).toHaveBeenCalledWith(placeId);
            expect(mockPlaceRepositoryGetAllUsersThatFavourited).toHaveBeenCalledTimes(1);
          });
    });
});

