import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendRequest, Place, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditProfileDto } from './dtos/edit-profile.dto';
import { SendRequestDto } from './dtos/send-request.dto';
import { FavouritePlaceDto } from './dtos/favourite-place.dto';
import { FriendshiptDto } from './dtos/friendship.dto';
import { FriendRequestDto } from './dtos/friend-request.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(): Promise<Partial<User>[]> {
    return this.prisma.user.findMany({
      select: {
        bio: true,
        code: true,
        email: true,
        id: true,
        name: true,
        instagram: true,
        username: true,
        twitter: true,
        tiktok: true,
        profilePicture: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<Partial<User>> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        bio: true,
        code: true,
        email: true,
        id: true,
        name: true,
        instagram: true,
        username: true,
        twitter: true,
        tiktok: true,
        profilePicture: true,
      },
    });
  }

  async insertCode(email: string, code: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: {
        code: code,
      },
    });
  }

  async changePassword(email: string, password: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: {
        password: password,
      },
    });
  }

  async addFavouritePlace(toggleFavouritePlaceDto: FavouritePlaceDto) {
    return this.prisma.userPlace.create({
      data: toggleFavouritePlaceDto,
    });
  }

  async removeFavouritePlace(toggleFavouritePlaceDto: FavouritePlaceDto) {
    return this.prisma.userPlace.deleteMany({
      where: {
        placeId: toggleFavouritePlaceDto.placeId,
        userId: toggleFavouritePlaceDto.userId,
      },
    });
  }

  async getUserFavouritePlaces(userId: number): Promise<Place[]> {
    const queryResult = await this.prisma.userPlace.findMany({
      where: {
        userId: userId,
      },
      select: {
        Place: {
          include: {
            _count: {
              select: { userPlace: true },
            },
          },
        },
      },
      distinct: 'placeId',
    });

    return queryResult.map((place) => place.Place);
  }

  async getUserById(id: number): Promise<Partial<User>> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        bio: true,
        code: true,
        email: true,
        id: true,
        name: true,
        instagram: true,
        username: true,
        twitter: true,
        tiktok: true,
        profilePicture: true,
      },
    });
  }

  async getFriendsUserById(id: number): Promise<Partial<User>[]> {
    const friends = await this.prisma.friendship.findMany({
      where: {
        OR: [
          { userId: id },
          { userId2: id },
        ],
      },
      include: {
        User2: true,
        User: true
      },
    });

    return friends.map((friendship) => friendship.userId === id ? friendship.User2 : friendship.User);
  }

  async removeFriendUserById(
    id: number,
    friendId: number,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.prisma.$transaction([
        this.prisma.friendship.deleteMany({
          where: {
            OR: [
              { userId: id, userId2: friendId },
              { userId: friendId, userId2: id },
            ],
          },
        }),
        this.prisma.friendRequest.deleteMany({
          where: {
            OR: [
              { userId: id, friendId: friendId },
              { userId: friendId, friendId: id },
            ],
          },
        }),
      ]);

      return {
        success: true,
        message: 'Remoção realizada com sucesso.',
      };
    } catch (error) {
      console.error('Erro ao remover o usuário:', error);

      return {
        success: false,
        message: 'Falha ao remover o usuário.',
      };
    }
  }

  async getUserByUsername(username: string, showPassword: boolean) {
    return this.prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        bio: true,
        code: true,
        email: true,
        id: true,
        name: true,
        instagram: true,
        username: true,
        twitter: true,
        tiktok: true,
        profilePicture: true,
        password: showPassword,
      },
    });
  }

  async insertUser(createUserDto: CreateUserDto): Promise<User> {
    const userData = {
      ...createUserDto,
      bio: '',
      instagram: '',
      tiktok: '',
      twitter: '',
      profilePicture: '',
    };
    return this.prisma.user.create({
      data: userData,
    });
  }

  async updateFriendshipStatus(request: FriendRequestDto) {
    const { userId, friendId, status } = request;
    
    return this.prisma.friendRequest.updateMany({
      where: {
        OR: [
          { userId: userId, friendId: friendId },
          { userId: friendId, friendId: userId },
        ],
      },
      data: {
        status,
      },
    });
  }

  async friendshipCreate(friendshiptDto: FriendshiptDto) {
    const friendship = {
      userId: friendshiptDto.userId,
      userId2: friendshiptDto.userId2,
    };

    if (friendship.userId != undefined && friendship.userId2 != undefined) {
      return this.prisma.friendship.create({
        data: friendship,
      });
    }
    return null;
  }

  async sendFriendRequest(
    sendRequestDto: SendRequestDto,
  ): Promise<FriendRequest> {
    return this.prisma.friendRequest.create({
      data: sendRequestDto,
    });
  }

  async editProfile(editProfileDto: EditProfileDto): Promise<User> {
    const id = editProfileDto.userId;
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário não encontrado para o id ${id}`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: editProfileDto.name ?? user.name,
        username: editProfileDto.username ?? user.username,
        profilePicture: editProfileDto.profilePicture ?? user.profilePicture,
        bio: editProfileDto.bio ?? user.bio,
        instagram: editProfileDto.instagram,
        tiktok: editProfileDto.tiktok,
        twitter: editProfileDto.twitter,
      },
    });
  }

  async getFriendRequestsById(id: number): Promise<Partial<FriendRequest>[]> {
    return this.prisma.friendRequest.findMany({
      where: {
        friendId: id,
        status: 'PENDING',
      },
      select: {
        id: false,
        userId: true,
        friendId: true,
        status: true,
      },
    });
  }
}
