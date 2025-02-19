'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IRoute } from '@/shared/interfaces/entities/route.interface';

import { StarIcon } from "@heroicons/react/24/solid";

export default function OneRouteMap({ route }: { route: IRoute }) {
    // const router = useRouter();
    // const [activeRoute, setActiveRoute] = useState<number | null>(null);

    useEffect(() => {
        // Configura iconos una sola vez
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // return () => {
        //     // Limpia mapa al desmontar
        //     const container = L.DomUtil.get('map');
        //     if (container) {
        //         // @ts-ignore
        //         container._leaflet_id = null;
        //     }
        // };
    }, []);

    // Calcula el centro del mapa tomando la primera coordenada de la ruta
    const center: [number, number] =
        route.coordinates && route.coordinates.length > 0
            ? [route.coordinates[Math.ceil(route.coordinates.length/1.6)].lat, route.coordinates[Math.ceil(route.coordinates.length/1.6)].lng]
            : [40.4168, -3.7038]; // Centro en Madrid

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
            zoom={14}
            className="w-full h-full rounded-t-2xl md:rounded-tl-none md:rounded-r-2xl  z-0"
            scrollWheelZoom={true}
            dragging={true}
        >
            {/* Capa base de OpenStreetMap */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <React.Fragment key={route.idRoute}>
                {/* Usa la primera coordenada de la ruta para el marker */}
                <Marker
                    position={[route.coordinates[0].lat, route.coordinates[0].lng]}
                    eventHandlers={{
                        mouseover: (e) => {
                            e.target.openPopup();
                        },
                        mouseout: (e) => {
                            e.target.closePopup();
                        }
                    }}
                >
                    <Popup>
                        <div className="cursor-pointer text-center">
                            {/* Localización */}
                            <div className="flex flex-row justify-center items-center text-xs font-medium text-gray-600">
                                <span  className="text-sm font-semibold text-teal-700">
                                    {route.location}
                                </span>
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {/* Si la ruta tiene más de un punto, se dibuja la línea que conecta las coordenadas */}
                {route.coordinates.length > 1 && (
                    <Polyline
                        positions={route.coordinates.map(coord => [coord.lat, coord.lng])}
                        pathOptions={{ 
                            color: 'hsl(213.1, 93.9%, 67.8%)',
                            weight: 7, // Grosor del trazo
                            opacity: 1, // Opacidad del trazo
                            dashArray: '5, 10', // Patrón de guiones
                            // lineJoin: 'round', // Unión de líneas redondeada
                            stroke: true, // Habilitar el trazo
                            fill: false, // Deshabilitar el relleno
                            fillColor: 'hsl(213.1, 93.9%, 67.8%)', // Color de relleno
                            fillOpacity: 0.5, // Opacidad del relleno
                        }}
                    />
                )}
            </React.Fragment>

        </MapContainer>
    );
};
