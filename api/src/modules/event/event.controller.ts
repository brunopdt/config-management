import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { Event } from '@prisma/client';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { RegisterPresenceDto } from './dtos/register-presence.dto';
import { Response } from 'express';

@ApiTags('Events')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @ApiQuery({
    name: 'userId',
    type: Number,
    description: 'A parameter. Optional',
    required: false,
  })
  @Get()
  async getEvents(@Query('userId') userId?: number): Promise<Event[]> {
    return this.eventService.getEvents(userId);
  }

  @Post()
  async insertEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.insertEvent(createEventDto);
  }

  @Post('attendance/toggle')
  async toggleRegisterPresence(@Body() registerPresenceDto: RegisterPresenceDto, @Res() res: Response) {
    const result = await this.eventService.toggleRegisterPresence(registerPresenceDto);
    return res.status(200).json(result);
  }
}
