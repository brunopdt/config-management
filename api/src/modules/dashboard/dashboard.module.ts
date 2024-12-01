import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DashboardRepository } from './dashboard.repository';
import { PrismaService } from 'prisma/prisma.service';
import { PlaceModule } from '../place/place.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [PlaceModule, EventModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository, PrismaService],
  exports: [DashboardService, DashboardRepository],
})
export class DashboardModule {}