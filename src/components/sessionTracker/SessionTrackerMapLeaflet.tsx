'use client';

import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ISessionTrackerMapLeafletProps } from '@/shared/interfaces/props/sessionTracker.props';

// Inyecta el @keyframes del pulso GPS en el <head> una sola vez.
// No se puede usar Tailwind aquí porque el HTML del divIcon se inyecta dinámicamente
// por Leaflet fuera del árbol de React, por lo que las clases no son procesadas.
function injectGpsPulseStyle() {
    const id = 'gps-pulse-keyframe';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
        @keyframes gps-pulse {
            0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.8; }
            100% { transform: translate(-50%, -50%) scale(2.8); opacity: 0;   }
        }
    `;
    document.head.appendChild(style);
}

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
    // Inyecta el CSS de animación al montar el componente
    useEffect(() => { injectGpsPulseStyle(); }, []);

    // Icono personalizado: anillo de pulso animado + halo blanco + punto azul.
    // L.divIcon permite HTML/CSS arbitrario; es la única forma de animar un marcador en Leaflet.
    // El azul (#3b82f6) es el color universal de "tu posición" (Google Maps, Apple Maps).
    const userPositionIcon = useMemo(() => L.divIcon({
        className: '',   // vacío para evitar los estilos por defecto de Leaflet
        html: `
            <div style="position:relative;width:20px;height:20px;">
                <div style="
                    position:absolute;top:50%;left:50%;
                    width:20px;height:20px;border-radius:50%;
                    background:rgba(59,130,246,0.4);
                    animation:gps-pulse 1.8s ease-out infinite;
                "></div>
                <div style="
                    position:absolute;top:50%;left:50%;
                    transform:translate(-50%,-50%);
                    width:16px;height:16px;border-radius:50%;
                    background:white;
                    box-shadow:0 1px 5px rgba(0,0,0,0.3);
                "></div>
                <div style="
                    position:absolute;top:50%;left:50%;
                    transform:translate(-50%,-50%);
                    width:10px;height:10px;border-radius:50%;
                    background:#3b82f6;
                "></div>
            </div>
        `,
        iconSize:   [20, 20],
        iconAnchor: [10, 10],
    }), []);

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
                    {/* Círculo de incertidumbre — radio en metros igual a la precisión GPS reportada */}
                    {gpsAccuracy !== null && (
                        <Circle
                            center={[gpsLat, gpsLng]}
                            radius={gpsAccuracy}
                            pathOptions={{
                                color: '#3b82f6',
                                fillColor: '#3b82f6',
                                fillOpacity: 0.1,
                                weight: 1,
                            }}
                        />
                    )}

                    {/* Punto de posición con pulso animado */}
                    <Marker
                        position={[gpsLat, gpsLng]}
                        icon={userPositionIcon}
                    />

                    {/* Auto-centra el viewport cuando cambia la posición */}
                    <FlyToPosition lat={gpsLat} lng={gpsLng} />
                </React.Fragment>
            )}
        </MapContainer>
    );
}
