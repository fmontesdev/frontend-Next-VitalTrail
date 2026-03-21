'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StarIcon } from '@heroicons/react/24/solid';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { IRoutes } from '@/shared/interfaces/entities/route.interface';
import ExpandableMap, { MapStateTracker, MapResizer } from '@/components/map/ExpandableMap';

// Fix de iconos Leaflet — CDN con retina support
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Centro y zoom — Península Ibérica
const IBERIAN_CENTER: [number, number] = [40.0, -4.0];
const IBERIAN_ZOOM = 6;          // vista colapsada (panel lateral)
const IBERIAN_ZOOM_EXPANDED = 7; // vista expandida (pantalla completa)

export default function RouteMap({ routes }: { routes: IRoutes | [] }) {
    const router = useRouter();
    const [activeRoute, setActiveRoute] = useState<number | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>(IBERIAN_CENTER);
    const [mapZoom, setMapZoom] = useState(IBERIAN_ZOOM);

    // Clave estable para la instancia colapsada (evita re-mount innecesarios)
    const collapsedKey = useMemo(() => 'route-list-map-collapsed', []);

    const capitalizeFirstLetter = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    /** Markers y polylines de cada ruta */
    const routeMarkers = (
        <>
            {Array.isArray(routes) ? null : routes.routes.map((route, index) => {
                if (!route.coordinates || route.coordinates.length === 0) return null;

                const markerPosition: [number, number] = [
                    route.coordinates[0].lat,
                    route.coordinates[0].lng,
                ];

                return (
                    <React.Fragment key={index}>
                        <Marker
                            position={markerPosition}
                            eventHandlers={{
                                mouseover: (e) => {
                                    e.target.openPopup();
                                    setActiveRoute(index);
                                },
                                mouseout: (e) => {
                                    e.target.closePopup();
                                    setActiveRoute(null);
                                },
                                click: () => {
                                    router.push(`/route/${route.slug}`);
                                },
                            }}
                        >
                            <Popup>
                                <div className="cursor-pointer text-center">
                                    {route.images && route.images.length > 0 && (
                                        <img
                                            src={getImageUrl('route', route.images[0].imgRoute)}
                                            alt={`Ruta ${route.title}`}
                                            className="w-full max-w-[200px] h-auto mb-1"
                                        />
                                    )}
                                    <h2 className="max-w-[150px] text-sm font-bold text-teal-700 line-clamp-2">
                                        {capitalizeFirstLetter(route.title)}
                                    </h2>
                                    <div className="flex flex-wrap justify-center text-sm font-medium text-gray-600">
                                        <div className="flex items-center gap-1 shrink-0">
                                            <StarIcon className="w-4 h-4" /> {route.averageRatings}&nbsp;&nbsp;•&nbsp;&nbsp;
                                            {capitalizeFirstLetter(route.difficulty)}
                                        </div>
                                        <span>
                                            {route.distance} km&nbsp;&nbsp;•&nbsp;&nbsp;
                                            {capitalizeFirstLetter(route.typeRoute)}
                                        </span>
                                        <span>Estimac. {route.duration} h</span>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Polyline solo cuando el marker está activo (hover) */}
                        {activeRoute === index && route.coordinates.length > 1 && (
                            <Polyline
                                positions={route.coordinates.map(coord => [coord.lat, coord.lng])}
                                pathOptions={{ color: 'hsl(213.1, 93.9%, 67.8%)' }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </>
    );

    /** Capas del mapa colapsado: tile + state tracker + markers */
    const collapsedLayers = (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* MapStateTracker solo en la vista colapsada — el expandido siempre arranca en IBERIAN */}
            <MapStateTracker onCenter={setMapCenter} onZoom={setMapZoom} />
            {routeMarkers}
        </>
    );

    /** Capas del mapa expandido: tile + resizer + markers */
    const expandedLayers = (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapResizer />
            {routeMarkers}
        </>
    );

    return (
        <ExpandableMap
            headerOffset={134}
            collapsed={
                <MapContainer
                    key={collapsedKey}
                    center={mapCenter}
                    zoom={mapZoom}
                    className="w-full h-full rounded-2xl z-0"
                    scrollWheelZoom={true}
                    dragging={true}
                >
                    {collapsedLayers}
                </MapContainer>
            }
            expanded={
                <MapContainer
                    key="route-list-map-expanded"
                    center={IBERIAN_CENTER}
                    zoom={IBERIAN_ZOOM_EXPANDED}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                    scrollWheelZoom={true}
                    dragging={true}
                >
                    {expandedLayers}
                </MapContainer>
            }
        />
    );
}
