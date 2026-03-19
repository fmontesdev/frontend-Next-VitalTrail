import { IRouteSession } from '../entities/routeSession.interface';
import { ICoordinates } from '../entities/route.interface';

export type ModalState = 'none' | 'tracker' | 'checkin';

export interface IActiveSessionBannerProps {
    session: IRouteSession;
    onResume: () => void;
}

export interface ISessionButtonProps {
    idRoute: number;
    routeSlug: string;
}

export interface ISessionTrackerMapProps {
    routeCoordinates: ICoordinates[];
    onPositionUpdate?: (lat: number, lng: number, accuracy: number) => void;
}

export interface ISessionTrackerMapLeafletProps {
    routeCoordinates: ICoordinates[];
    gpsLat: number | null;
    gpsLng: number | null;
    gpsAccuracy: number | null;
}

export interface ISessionTrackerProps {
    session: IRouteSession;
    onClose: () => void;
    onSessionEnded: () => void;
}

export interface IRatingSliderProps {
    label: string;
    name: string;
    value: number;
    onChange: (value: number) => void;
    /** Invierte los labels visuales: 1 = positivo, 5 = negativo (p. ej. estrés) */
    inverted?: boolean;
}

export interface IWellbeingCheckinFormProps {
    idSession: number;
    onClose: () => void;
    onSuccess: () => void;
}
