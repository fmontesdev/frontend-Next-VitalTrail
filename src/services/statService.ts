import apiService from './apiService';
import { IHomeStats } from '@/shared/interfaces/entities/stat.interface';

export const StatService = {
    getHomeStats(): Promise<IHomeStats> {
        return apiService.get<IHomeStats>('/stats/home');
    },
};
