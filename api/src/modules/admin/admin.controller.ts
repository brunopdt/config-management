import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from '@prisma/client';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/modules/auth/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginAdminDto } from './dtos/login-admin.dto';
import { ResetPasswordDto } from '../user/dtos/reset-password.dto';
import { EmailDto } from '../user/dtos/email.dto';

@ApiTags('Admins')
@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private authService: AuthService,
  ) {}

  @Get()
  async getAdmins(): Promise<Partial<Admin>[]> {
    return this.adminService.getAdmins();
  }

  @Post()
  async insertAdmin(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.insertAdmin(createAdminDto);
  }

  @UseGuards(AuthGuard('admin'))
  @Post('login')
  async login(@Body() req: LoginAdminDto) {
    return this.authService.login(req.username);
  }

  @Post('password-reset-email')
  async sendEmailResetPassword(@Body() email: EmailDto): Promise<Admin> {
    return this.adminService.resetPasswordEmail(email.email);
  }

  @Post('password-reset')
  async resetPassword(@Body() passwordDto: ResetPasswordDto) {
    return this.adminService.resetPassword(passwordDto);
  }
}
