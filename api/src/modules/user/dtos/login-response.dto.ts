import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    type: Number,
    name: 'id',
    example: 3,
  })
  id: number;

  @ApiProperty({
    type: String,
    name: 'name',
    example: 'Bruno',
  })
  name: string;

  @ApiProperty({
    type: String,
    name: 'username',
    example: 'brunogamer123',
  })
  username: string;

  @ApiProperty({
    type: String,
    name: 'accessToken',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJydW5vMTIzZ2FtZXIiLCJpYX',
  })
  accessToken: string;

  @ApiProperty({
    type: String,
    name: 'profilePicture',
    example:
      'https://linkdaimagem.com',
  })
  profilePicture: string;
}
