import { AxiosResponse } from 'axios';
import { useApi } from '../apis/axiosInstance';
import Event from '../models/Event';


class EventsService {
  async getEvents(userId?: number): Promise<AxiosResponse<Event[]>> {
    return useApi.get(`events?userId=${userId}`);
  }
}

export default new EventsService();
