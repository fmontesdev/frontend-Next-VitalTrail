import { useQuery } from '@tanstack/react-query';
import { StatService } from '@/services/statService';

export const useHomeStats = () => {
    return useQuery({
        queryKey: ['homeStats'],
        queryFn: StatService.getHomeStats,
        staleTime: 1000 * 60 * 5, // 5 minutos
        refetchOnMount: false,
    });
};
