import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
import { DashboardDto } from './dtos/dashboard.dto';
import { PlaceService } from '../place/place.service';
import { EventService } from '../event/event.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly dashboardRepository: DashboardRepository, 
        private readonly placeService: PlaceService, 
        private readonly eventService: EventService
    ) { }


    async getDashboard(): Promise<DashboardDto> {
        const ValueTotalUsers = await this.dashboardRepository.getTotalUsers();
        const ValueTotalEvents = await this.dashboardRepository.getTotalEvents();
        const ValueTotalPlaces = await this.dashboardRepository.getTotalPlaces();
        const top5Places = (await this.placeService.getPlaces()).slice(0, 5);
        const top5Events = (await this.eventService.getEvents()).slice(0, 5);

        return {
            ValueTotalUsers,
            ValueTotalPlaces,
            ValueTotalEvents,
            top5Places,
            top5Events,
        };
    }

} 