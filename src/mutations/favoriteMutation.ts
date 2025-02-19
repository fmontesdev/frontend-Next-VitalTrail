import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FavoriteService } from '@/services/favoriteService';
import { IRoute, IRoutes } from '@/shared/interfaces/entities/route.interface';

export const useFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => FavoriteService.favoriteRoute(slug),
        onSuccess: (updatedRoute: IRoute) => {
            // Actualizar todas las queries que tengan 'filteredRoutes' en su key
            queryClient.getQueryCache().findAll({
                predicate: (query) => query.queryKey[0] === 'filteredRoutes'
            }).forEach((query) => {
                queryClient.setQueryData<IRoutes | undefined>(
                    query.queryKey,
                    (oldData) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            routes: oldData.routes.map((route) =>
                                route.idRoute === updatedRoute.idRoute ? updatedRoute : route
                            ),
                        };
                    }
                );
            });

            // Actualizar la query de la ruta individual
            queryClient.setQueryData(
                ['route', updatedRoute.slug],
                updatedRoute
            );
            
            // Invalidar queries para asegurar datos frescos
            // queryClient.invalidateQueries({ queryKey: ['filteredRoutes'] });
            // queryClient.invalidateQueries({ queryKey: ['routes'] });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};

export const useUnfavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (slug: string) => FavoriteService.unfavoriteRoute(slug),
        onSuccess: (updatedRoute: IRoute) => {
            // Actualizar todas las queries que tengan 'filteredRoutes' en su key
            queryClient.getQueryCache().findAll({
                predicate: (query) => query.queryKey[0] === 'filteredRoutes'
            }).forEach((query) => {
                queryClient.setQueryData<IRoutes | undefined>(
                    query.queryKey,
                    (oldData) => {
                        if (!oldData) return oldData;
                        return {
                            ...oldData,
                            routes: oldData.routes.map((route) =>
                                route.idRoute === updatedRoute.idRoute ? updatedRoute : route
                            ),
                        };
                    }
                );
            });

            // Actualizar la query de la ruta individual
            queryClient.setQueryData(
                ['route', updatedRoute.slug],
                updatedRoute
            );
            
            // Invalidar queries para asegurar datos frescos
            // queryClient.invalidateQueries({ queryKey: ['filteredRoutes'] });
            // queryClient.invalidateQueries({ queryKey: ['route'] });
        },
        onError: (error) => {
            console.log(error);
        }
    });
};
