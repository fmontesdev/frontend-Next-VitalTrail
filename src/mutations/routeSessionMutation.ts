import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RouteSessionService } from '@/services/routeSessionService';
import { ICreateCheckinPayload } from '@/shared/interfaces/entities/routeSession.interface';
import { sessionKeys } from '@/queries/routeSessionQuery';

/**
 * Inicia una nueva sesión de ruta.
 * Invalida la sesión activa tras crear la nueva.
 */
export const useStartSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (idRoute: number) =>
            RouteSessionService.start({ session: { idRoute } }),
        onSuccess: async () => {
            // Esperamos a que el refetch complete antes de que el componente navegue,
            // para evitar que /tracking vea el cache con null y redirija a /routes.
            await queryClient.refetchQueries({ queryKey: sessionKeys.active() });
        },
    });
};

/**
 * Finaliza la sesión activa (POST /sessions/:id/end).
 * Invalida la sesión activa para que el banner desaparezca.
 */
export const useEndSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: number) => RouteSessionService.end(sessionId),
        onSuccess: (_, sessionId) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.active() });
            queryClient.invalidateQueries({ queryKey: sessionKeys.detail(sessionId) });
        },
    });
};

/**
 * Elimina una sesión.
 * Invalida la sesión activa.
 */
export const useDeleteSession = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: number) => RouteSessionService.delete(sessionId),
        onSuccess: (_, sessionId) => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.active() });
            queryClient.removeQueries({ queryKey: sessionKeys.detail(sessionId) });
        },
    });
};

/**
 * Crea el check-in de bienestar post-ruta.
 * Invalida el check-in de la sesión.
 */
export const useCreateCheckin = (sessionId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ICreateCheckinPayload) =>
            RouteSessionService.createCheckin(sessionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sessionKeys.checkin(sessionId) });
        },
    });
};
