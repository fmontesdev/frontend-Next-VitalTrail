import { ICoordinates } from '@/shared/interfaces/entities/route.interface';

const EARTH_RADIUS_METERS = 6_371_000;

/**
 * Calcula la distancia en metros entre dos coordenadas GPS usando la fórmula de Haversine.
 */
export function haversineDistanceMeters(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_METERS * c;
}

/**
 * Formatea una distancia en metros para mostrar en la UI.
 *  < 1000 m → "X m"
 * >= 1000 m → "X.XX km"
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Calcula la distancia total en metros de un trazado GPS compuesto por
 * una lista de coordenadas en formato tupla Leaflet `[lat, lng][]`.
 * Suma los segmentos consecutivos usando Haversine.
 * @returns Distancia total en metros, redondeada al metro más cercano.
 *          Devuelve 0 si hay menos de 2 puntos.
 */
export function calculateRouteDistance(coords: [number, number][]): number {
    if (coords.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < coords.length - 1; i++) {
        const [lat1, lng1] = coords[i];
        const [lat2, lng2] = coords[i + 1];
        total += haversineDistanceMeters(lat1, lng1, lat2, lng2);
    }
    return Math.round(total);
}

/**
 * Calcula la distancia en kilómetros entre dos coordenadas GPS en formato `{lat, lng}`.
 * @returns Distancia en kilómetros, redondeada a 1 decimal.
 */
export function haversineDistanceKm(coordA: ICoordinates, coordB: ICoordinates): number {
    const meters = haversineDistanceMeters(coordA.lat, coordA.lng, coordB.lat, coordB.lng);
    return Math.round((meters / 1000) * 10) / 10;
}
