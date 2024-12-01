import { Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { PlaceRepository } from './place.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PlaceController],
  providers: [PlaceService, PlaceRepository, PrismaService],
  exports: [PlaceService, PlaceRepository],
})
export class PlaceModule {}
