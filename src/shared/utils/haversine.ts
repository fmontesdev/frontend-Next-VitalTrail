import { ICoordinates } from '@/shared/interfaces/entities/route.interface';

const EARTH_RADIUS_KM = 6371;

/**
 * Calcula la distancia en kilómetros entre dos coordenadas geográficas
 * usando la fórmula de Haversine (distancia de círculo máximo).
 * @returns Distancia en kilómetros, redondeada a 1 decimal.
 */
export function calcularDistanciaKm(coordA: ICoordinates, coordB: ICoordinates): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(coordB.lat - coordA.lat);
    const dLng = toRad(coordB.lng - coordA.lng);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(coordA.lat)) * Math.cos(toRad(coordB.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}
