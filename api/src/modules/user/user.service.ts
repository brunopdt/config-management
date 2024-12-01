import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Place, User, FriendRequest } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import * as bcrypt from 'bcrypt';
import { EditProfileDto } from './dtos/edit-profile.dto';
import * as AWS from 'aws-sdk';
import { FavouritePlaceDto } from './dtos/favourite-place.dto';
import { EmailService } from '../email/email.service';
import * as jwt from 'jsonwebtoken';
import { SendRequestDto } from './dtos/send-request.dto';
import { FriendRequestDto } from './dtos/friend-request.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
  ) {}

  async getUsers(): Promise<Partial<User>[]> {
    return this.userRepository.getUsers();
  }

  async getUserById(id: number): Promise<Partial<User>> {
    const user = await this.userRepository.getUserById(id);

    if (!user) throw new NotFoundException('Usuário não encontrado com o id');

    return user;
  }

  async getFriendsUserById(id: number): Promise<Partial<User>[]> {
    const friends = await this.userRepository.getFriendsUserById(id);

    return friends;
  }

  async removeFriendUserById(
    id: number,
    friendId: number,
  ): Promise<{ success: boolean; message: string }> {
    const result = await this.userRepository.removeFriendUserById(id, friendId);

    return result;
  }

  async getUserFavouritePlaces(id: number): Promise<Place[]> {
    return await this.userRepository.getUserFavouritePlaces(id);
  }

  async toggleFavouritePlace(toggleFavouritePlaceDto: FavouritePlaceDto) {
    const userFavouritePlaces: Place[] = await this.getUserFavouritePlaces(
      toggleFavouritePlaceDto.userId,
    );

    return userFavouritePlaces
      .map((place) => place.id)
      .includes(toggleFavouritePlaceDto.placeId)
      ? await this.userRepository.removeFavouritePlace(toggleFavouritePlaceDto)
      : await this.userRepository.addFavouritePlace(toggleFavouritePlaceDto);
  }

  async insertUser(createUserDto: CreateUserDto): Promise<User> {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 8);
    return this.userRepository.insertUser(createUserDto);
  }

  async updateFriendshipStatus(request: FriendRequestDto) {
    return this.userRepository.updateFriendshipStatus(request);
  }

  async friendshipCreate(request: FriendRequestDto) {
    return this.userRepository.friendshipCreate({
      userId: request.userId,
      userId2: request.friendId,
    });
  }

  async insertFriendRequest(
    sendRequestDto: SendRequestDto,
  ): Promise<FriendRequest> {
    return this.userRepository.sendFriendRequest(sendRequestDto);
  }

  async resetPasswordEmail(email: string): Promise<User> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await this.userRepository.insertCode(email, verificationCode);
    this.emailService.sendMail(email, verificationCode);
    return user;
  }

  async resetPassword(passwordDto: ResetPasswordDto) {
    const user = await this.userRepository.getUserByEmail(passwordDto.email);

    if (user.code !== passwordDto.code) {
      throw new BadRequestException('Código Invalido');
    }

    passwordDto.newPassword = bcrypt.hashSync(passwordDto.newPassword, 8);
    return await this.userRepository.changePassword(
      passwordDto.email,
      passwordDto.newPassword,
    );
  }

  async findOne(
    username: string,
    showPassword?: boolean,
  ): Promise<Partial<User> | undefined> {
    return this.userRepository.getUserByUsername(username, showPassword);
  }

  async editProfile(editProfileDto: EditProfileDto): Promise<User> {
    return this.userRepository.editProfile(editProfileDto);
  }

  async uploadPicture(profilePicture: Express.Multer.File): Promise<string> {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-east-1',
    });

    const uploadParams = {
      Bucket: 'tis5',
      Key: `profile_pictures/${profilePicture.originalname}`,
      Body: profilePicture.buffer,
      ContentType: profilePicture.mimetype,
    };

    try {
      const data = await s3.upload(uploadParams).promise();
      return data.Location;
    } catch (error) {
      console.error('Error uploading picture to S3:', error);
      throw new Error('Failed to upload picture to S3');
    }
  }

  async authenticate(clientId: string, name: string) {
    if (!clientId || clientId.length < 1) {
      throw new Error('Invalid ID');
    }
    if (!name || name.length < 1) {
      throw new Error('Invalid name');
    }

    const token = jwt.sign(
      {
        client: clientId,
        channel: '7PfEC7lkelNl1Zx0',
        permissions: {
          '^observable-locations$': {
            publish: true,
            subscribe: true,
            history: 50,
          },
        },
        data: {
          name,
          color: '#FFC0CB',
        },
        exp: Math.floor(Date.now() / 1000) + 60 * 180,
      },
      'sdJucgfrZqr1FNkkZBjXTNiLxgi2fpdQ',
    );

    return token;
  }

  async listFriendRequestById(id: number): Promise<Partial<User>[]> {
    const friendRequests = await this.userRepository.getFriendRequestsById(id);

    const userList: Partial<User>[] = [];

    for (const friendRequest of friendRequests) {
      try {
        const user = await this.userRepository.getUserById(
          friendRequest.userId,
        );
        userList.push(user);
      } catch (error) {
        console.error(
          `Erro ao buscar usuário com id ${friendRequest.friendId}:`,
          error,
        );
      }
    }

    return userList;
  }
}
