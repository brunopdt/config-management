import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { EmailModule } from '../email/email.module';
import { QueueService } from '../queue/queue.service';

@Module({
  imports: [
    forwardRef(() => AuthModule), 
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, PrismaService, QueueService],
  exports: [UserService, UserRepository, QueueService],
})
export class UserModule {}
