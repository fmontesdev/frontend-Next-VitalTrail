import { useQuery } from '@tanstack/react-query';
import { CategoryRouteService } from '@/services/categoryRouteService';
import { ICategoryRoute } from '@/shared/interfaces/entities/categoryRoute.interface';

export const useCategoryRoutes = (initialData?: ICategoryRoute[]) => {
    return useQuery({
        queryKey: ['categoryRoute'],
        queryFn: () => CategoryRouteService.getAllCategory(),
        initialData: initialData,
        staleTime: 1000 * 60 * 15, // 10 minutos
        refetchOnMount: false,
    });
}
