export interface IRouteSession {
    idSession: number;
    idUser: string;
    idRoute: number;
    slug: string;
    title: string;
    distance: number | null;
    startAt: string;
    endAt: string | null;
    createdAt: string;
}

/** Sesión enriquecida con checkin embebido — usada en GET /sessions (lista paginada) */
export interface IRouteSessionSummary extends IRouteSession {
    checkin: IWellbeingCheckin | null;
}

/** Respuesta paginada de GET /sessions */
export interface ISessionsPage {
    sessions: IRouteSessionSummary[];
    sessionsCount: number;
}

export interface IWellbeingCheckin {
    idCheckin: number;
    idSession: number;
    energy: 1 | 2 | 3 | 4 | 5;
    stress: 1 | 2 | 3 | 4 | 5;
    mood: 1 | 2 | 3 | 4 | 5;
    notes: string | null;
    createdAt: string;
}

export interface ICreateSessionPayload {
    session: {
        idRoute: number;
    };
}

export interface IEndSessionPayload {
    session: {
        /** Distancia recorrida en metros */
        distance: number;
    };
}

export interface ICreateCheckinPayload {
    checkin: {
        energy: number;
        stress: number;
        mood: number;
        notes?: string;
    };
}
