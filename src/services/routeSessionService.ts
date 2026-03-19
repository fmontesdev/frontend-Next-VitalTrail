import apiService from './apiService';
import {
    IRouteSession,
    IWellbeingCheckin,
    ICreateSessionPayload,
    ICreateCheckinPayload,
} from '@/shared/interfaces/entities/routeSession.interface';

/** Umbral de precisión GPS aceptable en metros */
export const GPS_ACCURACY_THRESHOLD_METERS = 50;

/** Opciones para watchPosition */
export const WATCH_POSITION_OPTIONS: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 15000,
};

export const RouteSessionService = {
    /** GET /sessions — lista todas las sesiones del usuario autenticado */
    getAll(): Promise<IRouteSession[]> {
        return apiService
            .get<{ sessions: IRouteSession[] }>('/sessions')
            .then((data) => data.sessions);
    },

    /** GET /sessions/active — devuelve la sesión activa o lanza 404 si no hay ninguna */
    getActive(): Promise<IRouteSession> {
        return apiService
            .get<{ session: IRouteSession }>('/sessions/active')
            .then((data) => data.session);
    },

    /** GET /sessions/:id */
    getById(id: number): Promise<IRouteSession> {
        return apiService
            .get<{ session: IRouteSession }>(`/sessions/${id}`)
            .then((data) => data.session);
    },

    /** POST /sessions — inicia una nueva sesión; 409 si ya existe una activa */
    start(payload: ICreateSessionPayload): Promise<IRouteSession> {
        return apiService
            .post<{ session: IRouteSession }>('/sessions', payload)
            .then((data) => data.session);
    },

    /** POST /sessions/:id/end — finaliza la sesión; sin body */
    end(id: number): Promise<IRouteSession> {
        return apiService
            .post<{ session: IRouteSession }>(`/sessions/${id}/end`)
            .then((data) => data.session);
    },

    /** DELETE /sessions/:id — elimina la sesión (204 sin body) */
    delete(id: number): Promise<void> {
        return apiService.delete<void>(`/sessions/${id}`);
    },

    /** GET /checkins — lista todos los check-ins del usuario */
    getCheckins(): Promise<IWellbeingCheckin[]> {
        return apiService
            .get<{ checkins: IWellbeingCheckin[] }>('/checkins')
            .then((data) => data.checkins);
    },

    /** GET /sessions/:id/checkin — check-in de una sesión específica */
    getCheckin(sessionId: number): Promise<IWellbeingCheckin> {
        return apiService
            .get<{ checkin: IWellbeingCheckin }>(`/sessions/${sessionId}/checkin`)
            .then((data) => data.checkin);
    },

    /** POST /sessions/:id/checkin — crea el check-in post-ruta */
    createCheckin(
        sessionId: number,
        payload: ICreateCheckinPayload,
    ): Promise<IWellbeingCheckin> {
        return apiService
            .post<{ checkin: IWellbeingCheckin }>(`/sessions/${sessionId}/checkin`, payload)
            .then((data) => data.checkin);
    },
};
