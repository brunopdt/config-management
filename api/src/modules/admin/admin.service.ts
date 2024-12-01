import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from './dtos/create-admin.dto';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from '../user/dtos/reset-password.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly emailService: EmailService,
  ) { }

  async getAdmins(): Promise<Partial<Admin>[]> {
    return this.adminRepository.getAdmins();
  }

  async insertAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    createAdminDto.password = bcrypt.hashSync(createAdminDto.password, 8);
    return this.adminRepository.insertAdmin(createAdminDto);
  }

  async findOne(email: string): Promise<Partial<Admin> | undefined> {
    return this.adminRepository.getAdminByEmail(email);
  }

  async resetPasswordEmail(email: string): Promise<Admin> {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    this.emailService.sendMail(email, verificationCode);
    return await this.adminRepository.insertCode(email, verificationCode);
  }

  async resetPassword(passwordDto: ResetPasswordDto) {
    const admin = await this.adminRepository.getAdminByEmail(passwordDto.email);

    if (admin.code !== passwordDto.code) {
      throw new BadRequestException('Código Invalido');
    }

    passwordDto.newPassword = bcrypt.hashSync(passwordDto.newPassword, 8);
    return await this.adminRepository.changePassword(
      passwordDto.email,
      passwordDto.newPassword,
    );
  }
}
