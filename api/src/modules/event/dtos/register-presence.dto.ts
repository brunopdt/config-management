import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class RegisterPresenceDto {
    @IsInt()
    @ApiProperty({
        type: Number,
        name: 'eventId',
        example: 1,
        required: true,
    })
    eventId: number;

    @IsInt()
    @ApiProperty({
        type: Number,
        name: 'userId',
        example: 1,
        required: true,
    })
    userId: number;

}