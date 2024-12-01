import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FriendRequestStatus, User } from '@prisma/client';
import { CreateUserDto } from './dtos/create-user.dto';
import { FriendRequestDto } from './dtos/friend-request.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { EmailDto } from './dtos/email.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { EditProfileDto } from './dtos/edit-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FavouritePlaceDto } from './dtos/favourite-place.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { SendRequestDto } from './dtos/send-request.dto';
import { ListRequestDto } from './dtos/list-request.dto';
import { QueueService } from '../queue/queue.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly queueService: QueueService,
    private authService: AuthService
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(): Promise<Partial<User>[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Partial<User>> {
    return this.userService.getUserById(Number(id));
  }

  @Get('friends/:id')
  async getFriendsUserById(@Param('id') id: string): Promise<Partial<User>[]> {
    return this.userService.getFriendsUserById(Number(id));
  }

  @Get('removeFriend/:id/:friendId')
  async removeFriendUserById(
    @Param('id') id: string,
    @Param('friendId') friendId: string,
  ): Promise<{ success: boolean; message: string }> {
    return this.userService.removeFriendUserById(Number(id), Number(friendId));
  }

  @Post('friend-request')
  async acceptFriendRequest(@Body() request: FriendRequestDto) {
    try {
      await this.queueService.sendMessage({
        userId: request.userId,
        friendId: request.friendId,
        status: request.status,
      });
    } catch (error) {
      return error;
    }

    return { message: 'Message posted to the queue' };
  }

  @Post('response-outlier')
  async handleResponseSend(@Body() request: FriendRequestDto) {
    if (request.status == FriendRequestStatus.APPROVED) {
      this.userService.friendshipCreate(request);
    }
    return this.userService.updateFriendshipStatus(request);
  }

  @Post()
  async insertUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.insertUser(createUserDto);
  }

  @Post('password-reset-email')
  async sendEmailResetPassword(@Body() email: EmailDto): Promise<User> {
    return this.userService.resetPasswordEmail(email.email);
  }

  @Post('password-reset')
  async resetPassword(@Body() passwordDto: ResetPasswordDto) {
    return this.userService.resetPassword(passwordDto);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() req: LoginUserDto): Promise<LoginResponseDto> {
    const { access_token } = await this.authService.login(req.username);
    const body = await this.userService.findOne(req.username);

    const res = {
      accessToken: access_token,
      id: body.id,
      name: body.name,
      username: body.username,
      profilePicture: body.profilePicture,
    };

    return res;
  }

  @Post('localization-service')
  async authenticate(@Body() body: { clientId: string; name: string }) {
    return this.userService.authenticate(body.clientId, body.name);
  }

  @Post('favourites/toggle')
  async toggleFavouritePlace(
    @Body() toggleFavouritePlaceDto: FavouritePlaceDto,
  ) {
    return this.userService.toggleFavouritePlace(toggleFavouritePlaceDto);
  }

  @Put('edit/profile')
  async editProfile(@Body() editProfileDto: EditProfileDto): Promise<User> {
    return this.userService.editProfile(editProfileDto);
  }

  @Post('upload/picture')
  @UseInterceptors(FileInterceptor('profilePicture'))
  async uploadPicture(
    @UploadedFile() profilePicture: Express.Multer.File,
  ): Promise<string> {
    return this.userService.uploadPicture(profilePicture);
  }

  @Post('friendRequest/send')
  async sendFriendRequest(@Body() body: SendRequestDto) {
    return this.userService.insertFriendRequest(body);
  }

  @Post('friendRequest/list')
  async listFriendRequest(
    @Body() listRequest: ListRequestDto,
  ): Promise<Partial<User>[]> {
    return this.userService.listFriendRequestById(listRequest.userId);
  }
}
