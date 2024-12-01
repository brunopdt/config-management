import { IsEnum, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from '@prisma/client';

export class FriendRequestDto {
  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'userId',
    example: '123',
  })
  userId: number;

  @IsInt()
  @ApiProperty({
    type: Number,
    name: 'friendId',
    example: '123',
  })
  friendId: number;

  @IsEnum(FriendRequestStatus)
  @ApiProperty({
    enum: FriendRequestStatus,
    name: 'status',
    example: FriendRequestStatus.APPROVED,
  })
  status: FriendRequestStatus;
}
