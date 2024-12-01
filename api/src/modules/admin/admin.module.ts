import { Module, forwardRef } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminRepository } from './admin.repository';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [forwardRef(() => AuthModule), EmailModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository, PrismaService],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
