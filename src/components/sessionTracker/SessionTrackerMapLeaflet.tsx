'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ISessionTrackerMapLeafletProps } from '@/shared/interfaces/props/sessionTracker.props';

/** Centra el mapa automáticamente en la posición GPS cuando cambia */
function FlyToPosition({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo([lat, lng], map.getZoom(), { animate: true, duration: 1.5 });
    }, [lat, lng, map]);
    return null;
}

export default function SessionTrackerMapLeaflet({
    routeCoordinates,
    gpsLat,
    gpsLng,
    gpsAccuracy,
}: ISessionTrackerMapLeafletProps) {
    useEffect(() => {
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    // Clave única para evitar conflictos de instancia de Leaflet
    const mapKey = useMemo(() => `tracker-map-${Date.now()}`, []);

    // Centro inicial: aprox. 60% del recorrido (igual que OneRouteMap)
    const initialCenter: [number, number] = routeCoordinates.length > 0
        ? [
            routeCoordinates[Math.ceil(routeCoordinates.length / 1.6)].lat,
            routeCoordinates[Math.ceil(routeCoordinates.length / 1.6)].lng,
        ]
        : [40.4168, -3.7038]; // Fallback: Madrid

    return (
        <MapContainer
            key={mapKey}
            center={initialCenter}
            zoom={15}
            className="w-full h-full z-0"
            scrollWheelZoom={true}
            dragging={true}
        >
            {/* Capa base OpenStreetMap */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Trazado completo de la ruta como referencia visual */}
            {routeCoordinates.length > 1 && (
                <Polyline
                    positions={routeCoordinates.map(c => [c.lat, c.lng])}
                    pathOptions={{
                        color: 'hsl(213.1, 93.9%, 67.8%)',
                        weight: 5,
                        opacity: 0.8,
                        dashArray: '5, 10',
                        fill: false,
                    }}
                />
            )}

            {/* Posición GPS actual del usuario */}
            {gpsLat !== null && gpsLng !== null && (
                <React.Fragment>
                    {/* Círculo de incertidumbre (radio = precisión en metros) */}
                    {gpsAccuracy !== null && (
                        <Circle
                            center={[gpsLat, gpsLng]}
                            radius={gpsAccuracy}
                            pathOptions={{
                                color: '#16a34a',
                                fillColor: '#16a34a',
                                fillOpacity: 0.12,
                                weight: 1,
                            }}
                        />
                    )}

                    {/* Marcador puntual de posición */}
                    <CircleMarker
                        center={[gpsLat, gpsLng]}
                        radius={10}
                        pathOptions={{
                            color: 'white',
                            fillColor: '#16a34a',
                            fillOpacity: 1,
                            weight: 3,
                        }}
                    />

                    {/* Auto-centra el viewport cuando cambia la posición */}
                    <FlyToPosition lat={gpsLat} lng={gpsLng} />
                </React.Fragment>
            )}
        </MapContainer>
    );
}
