import { Place, Event } from '@prisma/client';

export class DashboardDto{
    ValueTotalUsers: number;
    ValueTotalPlaces: number;
    ValueTotalEvents: number;
    top5Places: Place[];
    top5Events: Event[];
}