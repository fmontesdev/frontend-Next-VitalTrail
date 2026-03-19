import { useQuery } from '@tanstack/react-query';
import { RouteSessionService } from '@/services/routeSessionService';

/** Query keys factory */
export const sessionKeys = {
    all: ['sessions'] as const,
    active: () => [...sessionKeys.all, 'active'] as const,
    detail: (id: number) => [...sessionKeys.all, id] as const,
    checkins: () => [...sessionKeys.all, 'checkins'] as const,
    checkin: (sessionId: number) => [...sessionKeys.all, sessionId, 'checkin'] as const,
};

/**
 * Obtiene la sesión activa del usuario autenticado.
 * 404 del backend se interpreta como "sin sesión activa" → devuelve null.
 */
export const useActiveSession = () => {
    return useQuery({
        queryKey: sessionKeys.active(),
        queryFn: async () => {
            try {
                return await RouteSessionService.getActive();
            } catch (error: any) {
                // 404 = no hay sesión activa → null (no es un error de red)
                if (error?.response?.status === 404) return null;
                throw error;
            }
        },
        staleTime: 1000 * 30, // 30 segundos — sesión activa puede cambiar frecuentemente
        refetchOnWindowFocus: true,
    });
};

/**
 * Obtiene una sesión por ID.
 */
export const useSession = (id: number) => {
    return useQuery({
        queryKey: sessionKeys.detail(id),
        queryFn: () => RouteSessionService.getById(id),
        enabled: id > 0,
        staleTime: 1000 * 60 * 5,
    });
};

/**
 * Obtiene el check-in de bienestar de una sesión específica.
 * 404 → no existe check-in aún → devuelve null.
 */
export const useSessionCheckin = (sessionId: number) => {
    return useQuery({
        queryKey: sessionKeys.checkin(sessionId),
        queryFn: async () => {
            try {
                return await RouteSessionService.getCheckin(sessionId);
            } catch (error: any) {
                if (error?.response?.status === 404) return null;
                throw error;
            }
        },
        enabled: sessionId > 0,
        staleTime: 1000 * 60 * 5,
    });
};
