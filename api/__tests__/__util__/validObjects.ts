import {
  Admin,
  Event,
  FriendRequest,
  FriendRequestStatus,
  Place,
  User,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { CreateEventDto } from 'src/modules/event/dtos/create-event.dto';
import { CreateAdminDto } from 'src/modules/admin/dtos/create-admin.dto';
import { CreatePlaceDto } from 'src/modules/place/dtos/create-place.dto';
import { CreateUserDto } from 'src/modules/user/dtos/create-user.dto';

const getValidEvent = (): Event => ({
  id: faker.number.int(),
  name: faker.word.sample(),
  date: faker.date.past(),
  duration: faker.string.alpha({ length: { min: 1, max: 4 } }),
  fullDay: true,
  placeId: faker.number.int(),
});

const getValidCreateEvenDto = (): CreateEventDto => ({
  name: faker.word.sample(),
  placeId: faker.number.int(),
  date: getShortDate(),
  duration: faker.string.alpha({ length: { min: 1, max: 4 } }),
  fullDay: true,
});

const getShortDate = (): string => faker.date.past().toISOString().slice(0, 10);

const getValidPlace = (): Place => ({
  id: faker.number.int(),
  name: faker.word.sample(),
  latitude: faker.number.int(),
  longitude: faker.number.int(),
});

const getValidAdmin = (): Admin => ({
  id: faker.number.int(),
  email: faker.internet.email(),
  password: faker.word.sample(),
  name: faker.word.sample(),
  code: faker.word.sample(),
});

const getValidCreateAdminDto = (): CreateAdminDto => ({
  email: faker.internet.email(),
  password: faker.word.sample(),
  name: faker.word.sample(),
});

const getValidCreatePlaceDto = (): CreatePlaceDto => ({
  name: faker.word.sample(),
  latitude: faker.number.int(),
  longitude: faker.number.int(),
});

const getValidUser = (): User => ({
  id: faker.number.int(),
  email: faker.internet.email(),
  password: faker.word.sample(),
  name: faker.word.sample(),
  code: faker.word.sample(),
  username: faker.word.sample(),
  bio: faker.word.sample(),
  instagram: faker.word.sample(),
  tiktok: faker.word.sample(),
  twitter: faker.word.sample(),
  profilePicture: faker.word.sample(),
});

const getValidCreateUserDto = (): CreateUserDto => ({
  email: faker.internet.email(),
  password: faker.word.sample(),
  name: faker.word.sample(),
  username: faker.word.sample(),
});

const getValidFriendRequest = (): FriendRequest => ({
  friendId: faker.number.int(),
  id: faker.number.int(),
  userId: faker.number.int(),
  status: FriendRequestStatus.APPROVED,
});

export {
  getValidEvent,
  getValidCreateEvenDto,
  getShortDate,
  getValidPlace,
  getValidAdmin,
  getValidCreateAdminDto,
  getValidCreatePlaceDto,
  getValidUser,
  getValidCreateUserDto,
  getValidFriendRequest,
};
