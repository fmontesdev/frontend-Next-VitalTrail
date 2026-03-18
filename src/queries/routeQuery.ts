import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { RouteService } from '@/services/routeService';
import { IFilter } from '@/shared/interfaces/filters/filters.interface';
import { IRoute, IRoutes } from '@/shared/interfaces/entities/route.interface';

// const key = 'routes'

export const useSearchRoutes = (title: string) => {
    return useQuery({
        queryKey: ['searchRoute', title],
        queryFn: () => RouteService.getFiltered({ title }),
        staleTime: 1000 * 60 * 4, // 4 minutos
        enabled: title.length > 0,
    });
}

export const useFilteredRoutes = (filters: IFilter, initialData?: IRoutes) => {
    return useQuery({
        queryKey: ['filteredRoutes', filters],
        queryFn: () => RouteService.getFiltered(filters),
        initialData: initialData,
        staleTime: 1000 * 60 * 4, // 4 minutos
        refetchOnMount: false, // evita refetch en hidratación
        refetchOnWindowFocus: false, // evita refetch al enfocar ventana
        refetchOnReconnect: false, // evita refetch al reconectar
        networkMode: 'offlineFirst', // intenta usar cache si está offline
        ...(initialData ? { keepPreviousData: true } : {}), // mantiene datos previos mientras carga nuevos
    });
}

export const useRoute = (slug: string, initialData?: IRoute ) => {
    return useQuery({
        queryKey: ['route', slug],
        queryFn: () => RouteService.getBySlug(slug),
        initialData: initialData,
        staleTime: 1000 * 60 * 4, // 4 minutos
    });
}

export const useTrendingRoutes = () => {
    return useQuery({
        queryKey: ['routes', 'trending'],
        queryFn: () => RouteService.getTrending(),
        staleTime: 10 * 60 * 1000,
        select: (data) => [...data].sort((a, b) => b.favoritesCount - a.favoritesCount),
    });
};

export const useInfiniteMyRoutes = (author: string) => {
    return useInfiniteQuery({
        queryKey: ['myRoutes', author],
        queryFn: ({ pageParam }) => RouteService.getFiltered({ limit: 6, offset: pageParam as number, author }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const loaded = allPages.flatMap(p => p.routes).length;
            return loaded < lastPage.routesCount ? loaded : undefined;
        },
        enabled: !!author,
    });
};
