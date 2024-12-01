import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/modules/user/user.service';
import { UserRepository } from '../../src/modules/user/user.repository';
import { EmailService } from '../../src/modules/email/email.service';
import { PrismaService } from 'prisma/prisma.service';
import {
  getValidUser,
  getValidCreateUserDto,
  getValidPlace,
  getValidFriendRequest,
} from '__tests__/__util__/validObjects';
import { FriendRequest, User } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from '../../src/modules/user/dtos/reset-password.dto';
import * as jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { FavouritePlaceDto } from 'src/modules/user/dtos/favourite-place.dto';
import { SendRequestDto } from 'src/modules/user/dtos/send-request.dto';
import { EditProfileDto } from 'src/modules/user/dtos/edit-profile.dto';
import { FriendRequestDto } from 'src/modules/user/dtos/friend-request.dto';

const mockUserRepositoryGet = jest.fn();
const mockUserRepositoryGetById = jest.fn();
const mockUserRepositoryGetFriendsById = jest.fn();
const mockUserRepositoryInsertUser = jest.fn();
const mockUserRepositoryGetByEmail = jest.fn();
const mockUserRepositoryInsertCode = jest.fn();
const mockUserRepositoryChangePassword = jest.fn();
const mockUserRepositoryGetUserFavouritePlaces = jest.fn();
const mockUserRepositoryRemoveFriendUserById = jest.fn();
const mockUserRepositoryGetByUsername = jest.fn();
const mockUserRepositoryFriendInvite = jest.fn();
const mockUserRepositoryFriendshipCreate = jest.fn();
const mockUserRepositorySendFriendRequest = jest.fn();
const mockUpdateFriendshipStatus = jest.fn();
const mockUserRepositoryEditProfile = jest.fn();
const mockUserRepositoryGetFriendRequestsById = jest.fn();
const mockUserRepositoryAddFavouritePlace = jest.fn();
const mockUserRepositoryRemoveFavouritePlace = jest.fn();
const mockUserRepositoryToggleFavouritePlace = jest.fn();

const mockEmailServiceSendMail = jest.fn();
const mockS3Upload = jest.fn();

const mockPrismaService = {};

jest.mock('../../src/modules/user/user.repository', () => ({
  UserRepository: jest.fn().mockImplementation(() => ({
    getUsers: mockUserRepositoryGet,
    getUserById: mockUserRepositoryGetById,
    getFriendsUserById: mockUserRepositoryGetFriendsById,
    removeFriendUserById: mockUserRepositoryRemoveFriendUserById,
    getUserFavouritePlaces: mockUserRepositoryGetUserFavouritePlaces,
    toggleFavouritePlace: mockUserRepositoryToggleFavouritePlace,
    insertUser: mockUserRepositoryInsertUser,
    getUserByEmail: mockUserRepositoryGetByEmail,
    insertCode: mockUserRepositoryInsertCode,
    getUserByUsername: mockUserRepositoryGetByUsername,
    changePassword: mockUserRepositoryChangePassword,
    friendInvite: mockUserRepositoryFriendInvite,
    friendshipCreate: mockUserRepositoryFriendshipCreate,
    sendFriendRequest: mockUserRepositorySendFriendRequest,
    editProfile: mockUserRepositoryEditProfile,
    getFriendRequestsById: mockUserRepositoryGetFriendRequestsById,
    addFavouritePlace: mockUserRepositoryAddFavouritePlace,
    removeFavouritePlace: mockUserRepositoryRemoveFavouritePlace,
    updateFriendshipStatus: mockUpdateFriendshipStatus,
  })),
}));

jest.mock('../../src/modules/email/email.service', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendMail: mockEmailServiceSendMail,
  })),
}));

jest.mock('aws-sdk', () => ({
  S3: jest.fn().mockImplementation(() => ({
    upload: mockS3Upload,
  })),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useClass: UserRepository },
        { provide: EmailService, useClass: EmailService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('getUsers', () => {
    it('given existing users, when getUsers is called, then it should return a list of users', async () => {
      const mockUsers = [getValidUser(), getValidUser()];

      mockUserRepositoryGet.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepositoryGet).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    it('given a valid id, when getUserById is called, then it should return the corresponding user', async () => {
      const userId = 1;
      const mockUser = getValidUser();

      mockUserRepositoryGetById.mockResolvedValue(mockUser);

      const result = await userService.getUserById(userId);

      expect(result).toEqual(mockUser);
      expect(mockUserRepositoryGetById).toHaveBeenCalledWith(userId);
      expect(mockUserRepositoryGetById).toHaveBeenCalledTimes(1);
    });

    it('given an invalid id, when getUserById is called, then it should throw NotFoundException', async () => {
      const userId = 999;

      mockUserRepositoryGetById.mockResolvedValue(null);

      await expect(userService.getUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepositoryGetById).toHaveBeenCalledWith(userId);
      expect(mockUserRepositoryGetById).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFriendsUserById', () => {
    it('given a valid user id, when getFriendsUserById is called, then it should return the list of friends', async () => {
      const userId = 1;
      const mockFriends = [getValidUser(), getValidUser()];

      mockUserRepositoryGetFriendsById.mockResolvedValue(mockFriends);

      const result = await userService.getFriendsUserById(userId);

      expect(result).toEqual(mockFriends);
      expect(mockUserRepositoryGetFriendsById).toHaveBeenCalledWith(userId);
      expect(mockUserRepositoryGetFriendsById).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeFriendUserById', () => {
    it('given valid ids, when removeFriendUserById is called, then it should return a success message', async () => {
      const userId = 1;
      const friendId = 2;

      const mockResult = {
        success: true,
        message: 'Remoção realizada com sucesso.',
      };

      mockUserRepositoryRemoveFriendUserById.mockResolvedValue(mockResult);

      const result = await userService.removeFriendUserById(userId, friendId);

      expect(result).toEqual(mockResult);
      expect(mockUserRepositoryRemoveFriendUserById).toHaveBeenCalledWith(
        userId,
        friendId,
      );
      expect(mockUserRepositoryRemoveFriendUserById).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserFavouritePlaces', () => {
    it('given a valid user id, when getUserFavouritePlaces is called, then it should return the user favourite places', async () => {
      const userId = 1;
      const mockFavouritePlaces = [getValidPlace(), getValidPlace()];

      mockUserRepositoryGetUserFavouritePlaces.mockResolvedValue(
        mockFavouritePlaces,
      );

      const result = await userService.getUserFavouritePlaces(userId);

      expect(result).toEqual(mockFavouritePlaces);
      expect(mockUserRepositoryGetUserFavouritePlaces).toHaveBeenCalledWith(
        userId,
      );
      expect(mockUserRepositoryGetUserFavouritePlaces).toHaveBeenCalledTimes(1);
    });
  });

  describe('toggleFavouritePlace', () => {
    it('given a valid toggleFavouritePlaceDto, when toggleFavouritePlace is called, then it should remove the favourite place', async () => {
      const toggleFavouritePlaceDto: FavouritePlaceDto = {
        userId: 1,
        placeId: 10,
      };

      const mockUserFavouritePlaces = [getValidPlace()];

      mockUserFavouritePlaces[0].id = toggleFavouritePlaceDto.placeId;

      mockUserRepositoryGetUserFavouritePlaces.mockResolvedValue(
        mockUserFavouritePlaces,
      );
      mockUserRepositoryRemoveFavouritePlace.mockResolvedValue(null);
      mockUserRepositoryAddFavouritePlace.mockResolvedValue(null);

      await userService.toggleFavouritePlace(toggleFavouritePlaceDto);

      expect(mockUserRepositoryGetUserFavouritePlaces).toHaveBeenCalledWith(
        toggleFavouritePlaceDto.userId,
      );
      expect(mockUserRepositoryGetUserFavouritePlaces).toHaveBeenCalledTimes(1);

      expect(mockUserRepositoryRemoveFavouritePlace).toHaveBeenCalledWith(
        toggleFavouritePlaceDto,
      );
      expect(mockUserRepositoryRemoveFavouritePlace).toHaveBeenCalledTimes(1);

      expect(mockUserRepositoryAddFavouritePlace).not.toHaveBeenCalled();
    });

    it('given a valid toggleFavouritePlaceDto, when toggleFavouritePlace is called, then it should add the favourite place', async () => {
      const toggleFavouritePlaceDto: FavouritePlaceDto = {
        userId: 1,
        placeId: 10,
      };

      const mockUserFavouritePlaces = [getValidPlace()];

      mockUserRepositoryGetUserFavouritePlaces.mockResolvedValue(
        mockUserFavouritePlaces,
      );
      mockUserRepositoryRemoveFavouritePlace.mockResolvedValue(null);
      mockUserRepositoryAddFavouritePlace.mockResolvedValue(null);

      await userService.toggleFavouritePlace(toggleFavouritePlaceDto);

      expect(mockUserRepositoryGetUserFavouritePlaces).toHaveBeenCalledWith(
        toggleFavouritePlaceDto.userId,
      );
      expect(mockUserRepositoryGetUserFavouritePlaces).toHaveBeenCalledTimes(1);

      expect(mockUserRepositoryAddFavouritePlace).toHaveBeenCalledWith(
        toggleFavouritePlaceDto,
      );
      expect(mockUserRepositoryRemoveFavouritePlace).not.toHaveBeenCalled();

      expect(mockUserRepositoryAddFavouritePlace).toHaveBeenCalledTimes(1);
    });
  });

  describe('insertUser', () => {
    it('given valid data, when insertUser is called, then it should insert a new user', async () => {
      const createUserDto = getValidCreateUserDto();

      await userService.insertUser(createUserDto);

      expect(mockUserRepositoryInsertUser).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepositoryInsertUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('friendshipCreate', () => {
    it('given valid friend response dto, when friendshipCreate is called, then it should create a friendship', async () => {
      const friendResponse: FriendRequestDto = {
        userId: 1,
        friendId: 2,
        status: 'APPROVED',
      };

      mockUserRepositoryFriendshipCreate.mockResolvedValue(null);

      await userService.friendshipCreate(friendResponse);

      expect(mockUserRepositoryFriendshipCreate).toHaveBeenCalledWith({
        userId: friendResponse.userId,
        userId2: friendResponse.friendId,
      });
      expect(mockUserRepositoryFriendshipCreate).toHaveBeenCalledTimes(1);
    });

    it('should log an error if user is not found while fetching friend requests', async () => {
      const userId = 123;

      const friendRequests: FriendRequest[] = [
        {
          id: 2,
          userId: 999,
          friendId: 888,
          status: 'PENDING',
        },
      ];

      mockUserRepositoryGetFriendRequestsById.mockResolvedValue(friendRequests);

      mockUserRepositoryGetById.mockImplementation(async (userId: number) => {
        throw new Error(`Erro ao buscar usuário com id ${userId}`);
      });

      const consoleErrorMock = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await userService.listFriendRequestById(userId);

      for (const request of friendRequests) {
        expect(mockUserRepositoryGetById).toHaveBeenCalledWith(request.userId);
      }

      expect(consoleErrorMock).toHaveBeenCalled();

      consoleErrorMock.mockRestore();
    });
  });

  describe('updateFriendshipStatus', () => {
    it('given valid friend response dto, when updateFriendshipStatus is called, then it should update the friendship status', async () => {
      const friendResponse: FriendRequestDto = {
        userId: 1,
        friendId: 2,
        status: 'APPROVED',
      };

      mockUpdateFriendshipStatus.mockResolvedValue(null);

      await userService.updateFriendshipStatus(friendResponse);

      expect(mockUpdateFriendshipStatus).toHaveBeenCalledWith(friendResponse);
      expect(mockUpdateFriendshipStatus).toHaveBeenCalledTimes(1);
    });
  });

  describe('insertFriendRequest', () => {
    it('given valid send request dto, when insertFriendRequest is called, then it should insert a friend request', async () => {
      const sendRequestDto: SendRequestDto = {
        userId: 1,
        friendId: 2,
      };

      const mockFriendRequest = getValidFriendRequest();

      mockUserRepositorySendFriendRequest.mockResolvedValue(mockFriendRequest);

      const result = await userService.insertFriendRequest(sendRequestDto);

      expect(result).toEqual(mockFriendRequest);
      expect(mockUserRepositorySendFriendRequest).toHaveBeenCalledWith(
        sendRequestDto,
      );
      expect(mockUserRepositorySendFriendRequest).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('given a username, when findOne is called, then it should return the corresponding user', async () => {
      const username = 'user1';

      const mockUser = getValidUser();

      mockUserRepositoryGetByUsername.mockResolvedValue(mockUser);

      const result = await userService.findOne(username);

      expect(result).toEqual(mockUser);
      expect(mockUserRepositoryGetByUsername).toHaveBeenCalledWith(
        username,
        undefined,
      );
      expect(mockUserRepositoryGetByUsername).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetPasswordEmail', () => {
    it('given an email, when resetPasswordEmail is called, then it should send a reset password email', async () => {
      const email = faker.internet.email();

      const user: User = getValidUser();
      user.email = email;

      mockUserRepositoryInsertCode.mockResolvedValue(user);

      const newUser: User = await userService.resetPasswordEmail(email);

      expect(mockUserRepositoryInsertCode).toHaveBeenCalledTimes(1);
      expect(mockEmailServiceSendMail).toHaveBeenCalledTimes(1);
      expect(newUser).not.toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('given valid password, when resetPassword is called, then it should reset the user password', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        email: 'user1@example.com',
        code: '123456',
        newPassword: 'newpassword',
      };
      const mockUser = getValidUser();
      mockUser.email = resetPasswordDto.email;
      mockUser.code = resetPasswordDto.code;

      mockUserRepositoryGetByEmail.mockResolvedValue(mockUser);

      await userService.resetPassword(resetPasswordDto);

      expect(mockUserRepositoryGetByEmail).toHaveBeenCalledWith(
        resetPasswordDto.email,
      );
      expect(mockUserRepositoryGetByEmail).toHaveBeenCalledTimes(1);
      expect(mockUserRepositoryChangePassword).toHaveBeenCalledTimes(1);
    });

    it('given invalid verification code, when resetPassword is called, then it should throw BadRequestException', async () => {
      const passwordDto: ResetPasswordDto = {
        email: 'user1@example.com',
        code: 'invalidcode',
        newPassword: 'newpassword',
      };
      const mockUser = getValidUser();

      mockUserRepositoryGetByEmail.mockResolvedValue(mockUser);

      await expect(userService.resetPassword(passwordDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserRepositoryGetByEmail).toHaveBeenCalledWith(
        passwordDto.email,
      );
      expect(mockUserRepositoryGetByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('editProfile', () => {
    it('given valid edit profile dto, when editProfile is called, then it should edit the user profile', async () => {
      const editProfileDto: EditProfileDto = {
        userId: 1,
        name: 'New Name',
        username: 'new_username',
        bio: 'New bio',
        instagram: 'new_instagram',
        tiktok: 'new_tiktok',
        twitter: 'new_twitter',
        profilePicture: 'string',
      };

      const mockUser = getValidUser();

      mockUserRepositoryEditProfile.mockResolvedValue(mockUser);

      const result = await userService.editProfile(editProfileDto);

      expect(result).toEqual(mockUser);
      expect(mockUserRepositoryEditProfile).toHaveBeenCalledWith(
        editProfileDto,
      );
      expect(mockUserRepositoryEditProfile).toHaveBeenCalledTimes(1);
    });

    it('given invalid user id, when editProfile is called, then it should throw NotFoundException', async () => {
      const editProfileDto: EditProfileDto = {
        userId: 999,
        name: 'New Name',
        username: 'new_username',
        bio: 'New bio',
        instagram: 'new_instagram',
        tiktok: 'new_tiktok',
        twitter: 'new_twitter',
        profilePicture: 'string',
      };

      mockUserRepositoryEditProfile.mockRejectedValue(
        new NotFoundException('Usuário não encontrado'),
      );

      await expect(userService.editProfile(editProfileDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockUserRepositoryEditProfile).toHaveBeenCalledWith(
        editProfileDto,
      );
      expect(mockUserRepositoryEditProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('listFriendRequestById', () => {
    it('given valid user id with friend requests, when listFriendRequestById is called, then it should return a list of users', async () => {
      const userId = 1;

      const mockFriendRequests: Partial<FriendRequest>[] = [
        { userId: 2 },
        { userId: 3 },
      ];

      const mockUsers: Partial<User>[] = [getValidUser(), getValidUser()];

      mockUserRepositoryGetFriendRequestsById.mockResolvedValue(
        mockFriendRequests,
      );
      mockUserRepositoryGetById
        .mockResolvedValueOnce(mockUsers[0])
        .mockResolvedValueOnce(mockUsers[1]);

      const result = await userService.listFriendRequestById(userId);

      expect(result).toEqual(mockUsers);
      expect(mockUserRepositoryGetFriendRequestsById).toHaveBeenCalledWith(
        userId,
      );
      expect(mockUserRepositoryGetFriendRequestsById).toHaveBeenCalledTimes(1);
      expect(mockUserRepositoryGetById).toHaveBeenCalledTimes(2);
    });
  });

  describe('uploadPicture', () => {
    it('given a valid file, when uploadPicture is called, then it should upload the picture to S3', async () => {
      const profilePicture: Express.Multer.File = {
        originalname: 'profile.jpg',
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      const mockS3Response = {
        Location: 'https://s3.amazonaws.com/tis5/profile_pictures/profile.jpg',
      };
      mockS3Upload.mockReturnValue({
        promise: jest.fn().mockResolvedValue(mockS3Response),
      });

      const result = await userService.uploadPicture(profilePicture);

      expect(result).toEqual(mockS3Response.Location);
      expect(mockS3Upload).toHaveBeenCalledWith(
        expect.objectContaining({
          Bucket: 'tis5',
          Key: `profile_pictures/${profilePicture.originalname}`,
          Body: profilePicture.buffer,
          ContentType: profilePicture.mimetype,
        }),
      );
    });

    it('given an error during upload, when uploadPicture is called, then it should throw an error', async () => {
      const profilePicture: Express.Multer.File = {
        originalname: 'profile.jpg',
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      mockS3Upload.mockReturnValue({
        promise: jest.fn().mockRejectedValue(new Error('Failed to upload')),
      });

      await expect(userService.uploadPicture(profilePicture)).rejects.toThrow(
        'Failed to upload picture to S3',
      );
    });
  });

  describe('authenticate', () => {
    it('given valid client ID and name, when authenticate is called, then it should return a JWT token', async () => {
      const clientId = 'validClientId';
      const name = 'validName';
      const mockToken = 'mockedToken';

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = await userService.authenticate(clientId, name);

      expect(result).toEqual(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          client: clientId,
          data: { name, color: '#FFC0CB' },
        }),
        'sdJucgfrZqr1FNkkZBjXTNiLxgi2fpdQ',
      );
    });

    it('given invalid client ID, when authenticate is called, then it should throw an error', async () => {
      const invalidClientId = '';
      const name = 'validName';

      await expect(
        userService.authenticate(invalidClientId, name),
      ).rejects.toThrow('Invalid ID');
    });

    it('given invalid name, when authenticate is called, then it should throw an error', async () => {
      const clientId = 'validClientId';
      const invalidName = '';

      await expect(
        userService.authenticate(clientId, invalidName),
      ).rejects.toThrow('Invalid name');
    });
  });
});
