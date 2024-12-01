import { IsDefined, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditProfileDto {
  @IsDefined()
  @IsInt({ message: 'userId deve ser um número inteiro.' })
  @Min(0, { message: 'UserId deve ser um número positivo.' })
  @ApiProperty({
    type: Number,
    name: 'userId',
    example: 1,
  })
  userId: number;

  @IsOptional()
  @IsString({ message: 'Nome deve ser uma string.' })
  @ApiProperty({
    type: String,
    name: 'name',
    example: 'Lucas Antônio',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'Nome de usuário deve ser uma string.' })
  @ApiProperty({
    type: String,
    name: 'username',
    example: 'lucas.antonio',
  })
  username: string;

  @IsOptional()
  @IsString({ message: 'Deve ser informada a imagem.' })
  @ApiProperty({
    type: String,
    name: 'profilePicture',
    example: 'imagem',
  })
  profilePicture: string;

  @IsOptional()
  @IsString({ message: 'Bio deve ser uma string.' })
  @ApiProperty({
    type: String,
    name: 'bio',
    example: 'Bio da pessoa',
  })
  bio: string;

  @IsOptional()
  @IsString({ message: 'Perfil do instagram deve ser uma string.' })
  @ApiProperty({
    type: String,
    name: 'instagram',
    example: '@lu_antonio',
  })
  instagram: string;

  @IsOptional()
  @IsString({ message: 'Perfil do tiktok deve ser uma string.' })
  @ApiProperty({
    type: String,
    name: 'tiktok',
    example: '@lu_antonio',
  })
  tiktok: string;

  @IsOptional()
  @IsString({ message: 'Perfil do twitter deve ser uma string.' })
  @ApiProperty({
    type: String,
    name: 'twitter',
    example: '@lu_antonio',
  })
  twitter: string;
}
