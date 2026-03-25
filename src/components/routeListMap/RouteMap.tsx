'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StarIcon } from '@heroicons/react/24/solid';
import { PhotoIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { formatDistance } from '@/shared/utils/distance';
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
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
                            <Popup
                                className="vt-route-popup"
                                closeButton={false}
                                minWidth={190}
                                maxWidth={190}
                            >
                                <div
                                    className="cursor-pointer w-[190px]"
                                    onClick={() => router.push(`/route/${route.slug}`)}
                                >
                                    {/* Imagen de cabecera */}
                                    {route.images && route.images.length > 0 ? (
                                        <div className="relative h-22 overflow-hidden">
                                            <img
                                                src={getImageUrl('route', route.images[0].imgRoute)}
                                                alt={route.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Gradiente sobre la imagen */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                                            {/* Badge dificultad — inferior izquierda */}
                                            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase bg-lime-600 text-white px-1.5 py-0.5 rounded-full tracking-wide">
                                                {CapitalizeFirstLetter(route.difficulty)}
                                            </span>
                                            {/* Badge tipo de ruta — inferior derecha */}
                                            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold uppercase bg-teal-700/80 text-white px-1.5 py-0.5 rounded-full tracking-wide">
                                                {CapitalizeFirstLetter(route.typeRoute)}
                                            </span>
                                            {/* Rating flotante — superior derecha */}
                                            <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5 shadow-sm">
                                                <StarIcon className="w-2.5 h-2.5 text-amber-500" />
                                                <span className="text-[10px] font-bold text-gray-800 leading-none">{route.averageRatings}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-20 bg-teal-50 flex flex-col items-center justify-center gap-1 border-b border-stone-100">
                                            <PhotoIcon className="w-6 h-6 text-teal-300" />
                                        </div>
                                    )}

                                    {/* Cuerpo del popup */}
                                    <div className="p-2.5">
                                        {/* Título */}
                                        <h2 className="text-[14px] font-black text-teal-700 line-clamp-2 leading-tight mb-1.5">
                                            {CapitalizeFirstLetter(route.title)}
                                        </h2>

                                        {/* Estadísticas: distancia y duración */}
                                        <div className="grid grid-cols-2 gap-1">
                                            <div className="flex flex-col items-center bg-stone-50 rounded-md px-1.5 py-1 border border-stone-100">
                                                <div className="flex items-center gap-0.5">
                                                    <MapPinIcon className="w-3 h-3 text-teal-500" />
                                                    <span className="text-[12px] font-semibold text-teal-700">{formatDistance(route.distance)}</span>
                                                </div>
                                                <span className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">Distancia</span>
                                            </div>
                                            <div className="flex flex-col items-center bg-stone-50 rounded-md px-1.5 py-1 border border-stone-100">
                                                <div className="flex items-center gap-0.5">
                                                    <ClockIcon className="w-3 h-3 text-teal-500" />
                                                    <span className="text-[12px] font-semibold text-teal-700">{route.duration} h</span>
                                                </div>
                                                <span className="text-[9px] text-gray-400 uppercase tracking-wide mt-0.5">Estimado</span>
                                            </div>
                                        </div>
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
