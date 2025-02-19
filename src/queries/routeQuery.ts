import { useQuery } from '@tanstack/react-query';
import { RouteService } from '@/services/routeService';
import { IFilter } from '@/shared/interfaces/filters/filters.interface';
import { IRoute, IRoutes } from '@/shared/interfaces/entities/route.interface';

// const key = 'routes'

export const useSearchRoutes = (title: string) => {
    return useQuery({
        queryKey: ['searchRoute', title],
        queryFn: () => RouteService.getFiltered({ title }),
        staleTime: 1000 * 120, // 2 minutos
        enabled: title.length > 0,
    });
}

export const useFilteredRoutes = (filters: IFilter, initialData?: IRoutes ) => {
    return useQuery({
        queryKey: ['filteredRoutes', filters],
        queryFn: () => RouteService.getFiltered(filters),
        initialData: initialData,
        staleTime: 1000 * 120, // 2 minutos
    });
}

export const useRoute = (slug: string, initialData?: IRoute ) => {
    return useQuery({
        queryKey: ['route', slug],
        queryFn: () => RouteService.getBySlug(slug),
        initialData: initialData,
        staleTime: 1000 * 120, // 2 minutos
    });
}
