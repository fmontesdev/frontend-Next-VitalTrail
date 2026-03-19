'use client';

import { useEffect, useState } from 'react';
import { WATCH_POSITION_OPTIONS } from '@/services/routeSessionService';
import { ISessionTrackerMapProps } from '@/shared/interfaces/props/sessionTracker.props';
import SessionTrackerMapLeaflet from './SessionTrackerMapLeaflet';

interface IGpsState {
    lat: number | null;
    lng: number | null;
    accuracy: number | null;
    status: 'idle' | 'watching' | 'denied' | 'error';
}

export default function SessionTrackerMap({ routeCoordinates, onPositionUpdate }: ISessionTrackerMapProps) {
    const [gps, setGps] = useState<IGpsState>({
        lat: null,
        lng: null,
        accuracy: null,
        status: 'idle',
    });

    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setGps((prev) => ({ ...prev, status: 'error' }));
            return;
        }

        setGps((prev) => ({ ...prev, status: 'watching' }));

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setGps((prev) => {
                    const newLat = pos.coords.latitude;
                    const newLng = pos.coords.longitude;
                    const newAcc = Math.round(pos.coords.accuracy);
                    // Evitar re-render si el desplazamiento es imperceptible (~1 m)
                    if (
                        prev.status === 'watching' &&
                        prev.lat !== null &&
                        prev.lng !== null &&
                        Math.abs(newLat - prev.lat) < 0.00001 &&
                        Math.abs(newLng - prev.lng) < 0.00001 &&
                        Math.abs(newAcc - (prev.accuracy ?? 0)) < 5
                    ) {
                        return prev;
                    }
                    return {
                        lat: newLat,
                        lng: newLng,
                        accuracy: newAcc,
                        status: 'watching',
                    };
                });
            },
            (err) => {
                setGps((prev) => ({
                    ...prev,
                    status: err.code === GeolocationPositionError.PERMISSION_DENIED ? 'denied' : 'error',
                }));
            },
            WATCH_POSITION_OPTIONS,
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Propagar la posición GPS al componente padre cuando cambia
    useEffect(() => {
        if (gps.lat !== null && gps.lng !== null && gps.accuracy !== null && onPositionUpdate) {
            onPositionUpdate(gps.lat, gps.lng, gps.accuracy);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gps.lat, gps.lng, gps.accuracy]);

    return (
        <div className="relative w-full h-full">
            <SessionTrackerMapLeaflet
                routeCoordinates={routeCoordinates}
                gpsLat={gps.lat}
                gpsLng={gps.lng}
                gpsAccuracy={gps.accuracy}
            />

            {/* Esperando señal por primera vez */}
            {gps.status === 'watching' && gps.lat === null && (
                <div className="
                    absolute bottom-24 left-1/2 -translate-x-1/2 z-[1000]
                    px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-medium
                    whitespace-nowrap
                ">
                    Obteniendo señal GPS…
                </div>
            )}

            {/* GPS denegado o error */}
            {(gps.status === 'denied' || gps.status === 'error') && (
                <div className="
                    absolute bottom-24 left-1/2 -translate-x-1/2 z-[1000]
                    px-3 py-1.5 rounded-full bg-red-600/90 text-white text-xs font-medium
                    whitespace-nowrap
                ">
                    {gps.status === 'denied' ? 'Activa la ubicación GPS' : 'Error de señal GPS'}
                </div>
            )}
        </div>
    );
}
