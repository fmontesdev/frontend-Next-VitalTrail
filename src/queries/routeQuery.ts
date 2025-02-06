import { useQuery } from '@tanstack/react-query';
import { RouteService } from '@/services/routeService';

const key = 'routes'

export const useSearchRoutes = (title: string) => {
    return useQuery({
        queryKey: [key, title],
        queryFn: () => RouteService.getFiltered({ title }),
        staleTime: 1000 * 120, // 2 minutos
        enabled: title.length > 0,
    });
}
