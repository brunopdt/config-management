import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { EventRepository } from './event.repository';
import { PrismaService } from 'prisma/prisma.service';
import { PlaceModule } from '../place/place.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PlaceModule, EmailModule],
  controllers: [EventController],
  providers: [EventService, EventRepository, PrismaService],
  exports: [EventService, EventRepository],
})
export class EventModule {}
