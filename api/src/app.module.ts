import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PlaceModule } from './modules/place/place.module';
import { EventModule } from './modules/event/event.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EmailModule } from './modules/email/email.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    PlaceModule,
    EventModule,
    AuthModule,
    UserModule,
    EmailModule,
    DashboardModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
