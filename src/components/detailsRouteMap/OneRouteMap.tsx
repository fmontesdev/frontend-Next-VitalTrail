'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { IRoute, ICoordinates } from '@/shared/interfaces/entities/route.interface';
import ExpandableMap, { MapStateTracker, MapResizer } from '@/components/map/ExpandableMap';

// Fix de iconos Leaflet — CDN con retina support
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos de inicio (verde) y fin (rojo)
const startIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const endIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

/**
 * Ajusta el viewport al encuadre primera↔última coordenada solo en el primer mount.
 * Usa `fitBounds` con padding generoso para que la ruta quede bien centrada.
 */
function MapBoundsInitializer({ coordinates }: { coordinates: ICoordinates[] }) {
    const map = useMap();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (initializedRef.current) return;
        if (coordinates.length < 2) return;

        initializedRef.current = true;
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        map.fitBounds(
            [[first.lat, first.lng], [last.lat, last.lng]],
            { padding: [40, 40], maxZoom: 15 }
        );
    // map es estable tras el mount — no necesita ir en deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coordinates]);

    return null;
}

export default function OneRouteMap({ route }: { route: IRoute }) {
    // Memoizado para que `initialCenter` no cambie en cada render por la expresión `?? []`
    const coords = useMemo(() => route.coordinates ?? [], [route.coordinates]);

    // Centro inicial: punto intermedio del recorrido (comportamiento original)
    const initialCenter = useMemo<[number, number]>(() => {
        if (coords.length > 0) {
            const idx = Math.min(Math.ceil(coords.length / 1.6), coords.length - 1);
            return [coords[idx].lat, coords[idx].lng];
        }
        return [40.4168, -3.7038]; // fallback: Madrid
    }, [coords]);

    const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);
    const [mapZoom, setMapZoom] = useState(14);

    // Clave estable para la instancia colapsada (evita re-mount innecesarios)
    const collapsedKey = useMemo(() => `route-map-collapsed-${route.idRoute}`, [route.idRoute]);

    /** Capas compartidas del mapa (tiles + polilínea + marcadores) */
    const mapLayers = (isPortal: boolean) => (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapStateTracker onCenter={setMapCenter} onZoom={setMapZoom} />
            {isPortal && <MapResizer />}

            {/* Ajuste de encuadre al primer mount — solo si hay coords */}
            {coords.length >= 2 && (
                <MapBoundsInitializer coordinates={coords} />
            )}

            {/* Polilínea del recorrido */}
            {coords.length > 1 && (
                <Polyline
                    positions={coords.map(c => [c.lat, c.lng])}
                    pathOptions={{
                        color: 'hsl(213.1, 93.9%, 67.8%)',
                        weight: 7,
                        opacity: 1,
                        dashArray: '5, 10',
                        fill: false,
                    }}
                />
            )}

            {/* Marcador de inicio */}
            {coords.length >= 1 && (
                <Marker position={[coords[0].lat, coords[0].lng]} icon={startIcon}>
                    <Popup>
                        <span className="text-sm font-semibold text-teal-700">Inicio</span>
                    </Popup>
                </Marker>
            )}

            {/* Marcador de fin — sin popup */}
            {coords.length >= 2 && (
                <Marker
                    position={[coords[coords.length - 1].lat, coords[coords.length - 1].lng]}
                    icon={endIcon}
                />
            )}
        </>
    );

    return (
        <ExpandableMap
            headerOffset={62}
            collapsed={
                <MapContainer
                    key={collapsedKey}
                    center={mapCenter}
                    zoom={mapZoom}
                    className="w-full h-full rounded-t-2xl md:rounded-tl-none md:rounded-r-2xl z-0"
                    scrollWheelZoom={true}
                    dragging={true}
                >
                    {mapLayers(false)}
                </MapContainer>
            }
            expanded={
                <MapContainer
                    key="route-map-expanded"
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                    scrollWheelZoom={true}
                    dragging={true}
                >
                    {mapLayers(true)}
                </MapContainer>
            }
        />
    );
}
