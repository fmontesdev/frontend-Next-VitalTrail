'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IRoutes } from '@/shared/interfaces/entities/route.interface';
import { StarIcon } from "@heroicons/react/24/solid";

export default function RouteMap({ routes }: { routes: IRoutes | [] }) {
    const router = useRouter();
    const [activeRoute, setActiveRoute] = useState<number | null>(null);

    useEffect(() => {
        // Configura iconos una sola vez
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
    }, []);

    // Calcula el centro del mapa tomando la primera coordenada de la primera ruta
    const center: [number, number] =
        Array.isArray(routes) || routes.routes.length === 0
            ? [40.4168, -3.7038] // Centro en Madrid
            : [routes.routes[0].coordinates[0].lat, routes.routes[0].coordinates[0].lng];

    // Genera un id único solo una vez para el contenedor del mapa
    const mapKey = useMemo(() => `map-${Date.now()}`, []);

    // Función para capitalizar la primera letra de un texto
    const capitalizeFirstLetter = (text: string) => 
        text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <MapContainer
            id="map"
            key={mapKey}
            center={center}
            zoom={9}
            className="w-full h-full rounded-2xl"
            scrollWheelZoom={true}
            dragging={true}
        >
            {/* Capa base de OpenStreetMap */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Recorre las rutas para crear markers y, si hay varios puntos, dibuja la ruta */}
            {Array.isArray(routes) ? null : routes.routes.map((route, index) => {
                // Valida que la ruta tenga al menos una coordenada
                if (!route.coordinates || route.coordinates.length === 0) return null;

                // Usa la primera coordenada de la ruta para el marker
                const markerPosition: [number, number] = [route.coordinates[0].lat, route.coordinates[0].lng];

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
                                    {/* Imagen de la ruta */}
                                    {route.images && (
                                        <img
                                            src={`/route_images/${route.images[0].imgRoute}`}
                                            alt={`Ruta ${route.title}`}
                                            className="w-full max-w-[200px] h-auto mb-1"
                                        />
                                    )}
                                    {/* Detalles de la ruta */}
                                    <h2 className="max-w-[150px] text-sm font-bold text-teal-700 line-clamp-2">{capitalizeFirstLetter(route.title)}</h2>
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

                        {/* Si la ruta tiene más de un punto, se dibuja la línea que conecta las coordenadas */}
                        {activeRoute === index && route.coordinates.length > 1 && (
                            <Polyline
                                positions={route.coordinates.map(coord => [coord.lat, coord.lng])}
                                pathOptions={{ color: 'hsl(213.1, 93.9%, 67.8%)' }}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </MapContainer>
    );
};
