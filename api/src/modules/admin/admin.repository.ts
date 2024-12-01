import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAdminDto } from './dtos/create-admin.dto';

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAdmins(): Promise<Partial<Admin>[]> {
    return this.prisma.admin.findMany({
      select: {
        email: true,
        name: true,
        id: true,
      },
    });
  }

  async insertAdmin(createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.prisma.admin.create({
      data: createAdminDto,
    });
  }

  async getAdminByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
        name: true,
        id: true,
        password: true,
        code: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<Partial<Admin>> {
    return this.prisma.admin.findUnique({
      where: {
        email: email,
      },
      select: {
        email: true,
        name: true,
        id: true,
        code: true,
      },
    });
  }

  async insertCode(email: string, code: string): Promise<Admin> {
    return this.prisma.admin.update({
      where: { email },
      data: {
        code: code,
      },
    });
  }

  async changePassword(email: string, password: string): Promise<Admin> {
    return this.prisma.admin.update({
      where: { email },
      data: {
        password: password,
      },
    });
  }
}
