export interface IRouteSession {
    idSession: number;
    idUser: string;
    idRoute: number;
    slug: string;
    startAt: string;
    endAt: string | null;
    createdAt: string;
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

export interface ICreateCheckinPayload {
    checkin: {
        energy: number;
        stress: number;
        mood: number;
        notes?: string;
    };
}
