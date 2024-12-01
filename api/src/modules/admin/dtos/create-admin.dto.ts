import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @IsEmail()
  // coloquem @ApiProperty em todos os atributos do DTO, para que apareça na documentação do swagger igual o exemplo abaixo:
  @ApiProperty({
    type: String,
    name: 'email',
    example: 'bruno@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    type: String,
    name: 'password',
    example: '12345678',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    name: 'name',
    example: 'bruno',
  })
  name: string;
}
