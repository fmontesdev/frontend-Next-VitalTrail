'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RouteService } from '@/services/routeService';
import { ICreateRoute, IRoute } from '@/shared/interfaces/entities/route.interface';
import { IImagesRoute } from '@/shared/interfaces/entities/imageRoute.interface';

/**
 * Mutation para crear una nueva ruta.
 * - Invalida las queries de rutas tras el éxito.
 * - La redirección la gestiona el wizard tras completar la subida de imágenes.
 */
export const useCreateRoute = () => {
    const queryClient = useQueryClient();

    return useMutation<IRoute, Error, ICreateRoute>({
        mutationFn: (data: ICreateRoute) => RouteService.createRoute(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['filteredRoutes'] });
            queryClient.invalidateQueries({ queryKey: ['routes'] });
        },
    });
};

/**
 * Mutation para subir una imagen a una ruta ya creada.
 * - Envía el archivo como multipart/form-data al endpoint POST /routes/{idRoute}/images/upload.
 */
export function useUploadRouteImage() {
    return useMutation<IImagesRoute, Error, { idRoute: number; file: File }>({
        mutationFn: ({ idRoute, file }) => RouteService.uploadImage(idRoute, file),
    });
}
