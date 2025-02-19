import { useQuery } from '@tanstack/react-query';
import { CategoryRouteService } from '@/services/categoryRouteService';

export const useCategoryRoutes = () => {
    return useQuery({
        queryKey: ['categoryRoute'],
        queryFn: () => CategoryRouteService.getAllCategory(),
        staleTime: 1000 * 120, // 2 minutos
    });
}
