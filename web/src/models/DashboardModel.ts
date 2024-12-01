import DashboardPlace from './DashboardPlace';
import DashboardEvent from './DashboardEvent';

export default class DashboardModel {
    ValueTotalUsers?: number;
    ValueTotalEvents?: number;
    ValueTotalPlaces?: number;
    top5Places?: Array<DashboardPlace>;
    top5Events?: Array<DashboardEvent>;
}

   