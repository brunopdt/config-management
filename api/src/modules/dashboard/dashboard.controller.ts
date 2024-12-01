import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardDto } from './dtos/dashboard.dto';
import { ApiTags } from '@nestjs/swagger';
import { Place } from '@prisma/client';
import { User } from "@prisma/client";
import { Event } from "@prisma/client";



@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(): Promise<DashboardDto> {
    return this.dashboardService.getDashboard();
  }

}