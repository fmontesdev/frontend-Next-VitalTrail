'use client';

import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FormikErrors, FormikTouched } from 'formik';
import {
    ArrowUturnLeftIcon,
    TrashIcon,
    ArrowsRightLeftIcon,
    MapPinIcon,
    ArrowsPointingOutIcon,
    ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';
import { ICreateRoute } from '@/shared/interfaces/entities/route.interface';
import { calculateRouteDistance, formatDistance } from '@/shared/utils/distance';
import ExpandableMap, { MapStateTracker, MapResizer } from '@/components/map/ExpandableMap';

// Fix de iconos Leaflet — mismo patrón que OneRouteMap.tsx
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados para inicio (verde) y fin (rojo)
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

interface IStep4Props {
    values: ICreateRoute;
    errors: FormikErrors<ICreateRoute>;
    touched: FormikTouched<ICreateRoute>;
    setFieldValue: (field: string, value: unknown) => void;
}

/** Hook interno de Leaflet — NO puede ser dynamic */
function MapClickHandler({ onAdd }: { onAdd: (coord: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            onAdd([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function Step4MapAndReview({
    values,
    errors,
    setFieldValue,
}: IStep4Props) {
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.4168, -3.7038]);
    const [mapZoom, setMapZoom] = useState(6);

    // Geolocalización silenciosa — fallback a España
    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setMapCenter([pos.coords.latitude, pos.coords.longitude]);
                    setMapZoom(13);
                },
                () => {} // silencioso — se queda en España
            );
        }
    }, []);

    // Clave estable para la instancia colapsada (evita re-mount innecesarios)
    const collapsedKey = useMemo(() => `map-collapsed-${Date.now()}`, []);

    const coords = values.coordinates;
    const hasCoords = coords.length > 0;

    // Auto-cálculo de distancia a partir del trazado
    const [distanceAutoCalculated, setDistanceAutoCalculated] = useState(false);
    useEffect(() => {
        if (coords.length >= 2) {
            const meters = calculateRouteDistance(coords);
            setFieldValue('distance', meters);
            setDistanceAutoCalculated(true);
        } else {
            setDistanceAutoCalculated(false);
        }
    // setFieldValue es estable (ref de Formik), no necesita ir en deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coords]);

    const handleAddCoord = (coord: [number, number]) => {
        const newCoords = [...values.coordinates, coord];
        setFieldValue('coordinates', newCoords);
    };

    const handleUndo = () => {
        const newCoords = values.coordinates.slice(0, -1);
        setFieldValue('coordinates', newCoords);
    };

    const handleClear = () => {
        setFieldValue('coordinates', []);
    };

    const coordError = typeof errors.coordinates === 'string' ? errors.coordinates : null;

    /** Contenido compartido dentro del MapContainer (capas) */
    const mapContents = (isPortal: boolean) => (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapClickHandler onAdd={handleAddCoord} />
            <MapStateTracker onCenter={setMapCenter} onZoom={setMapZoom} />
            {isPortal && <MapResizer />}

            {/* Polilínea del recorrido */}
            {coords.length > 1 && (
                <Polyline
                    positions={coords}
                    pathOptions={{
                        color: '#0d9488', // teal-600
                        weight: 5,
                        opacity: 1,
                        fill: false,
                    }}
                />
            )}

            {/* Marcador de inicio */}
            {coords.length >= 1 && (
                <Marker position={coords[0]} icon={startIcon}>
                    <Popup>Inicio</Popup>
                </Marker>
            )}

            {/* Marcador de fin (solo si hay al menos 2 puntos) */}
            {coords.length >= 2 && (
                <Marker position={coords[coords.length - 1]} icon={endIcon}>
                    <Popup>Fin</Popup>
                </Marker>
            )}
        </>
    );

    /** Píldoras de estado (distancia + puntos) — compartidas en expand y shrink triggers */
    const statusBadges = (
        <>
            {distanceAutoCalculated && values.distance > 0 && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-lime-700 bg-white border border-lime-200 rounded-full px-3 py-1.5 shadow-sm pointer-events-auto">
                    <ArrowsRightLeftIcon className="w-3.5 h-3.5" />
                    {formatDistance(values.distance)}
                </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1.5 shadow-sm pointer-events-auto">
                <MapPinIcon className="w-3.5 h-3.5 text-teal-500" />
                {coords.length} {coords.length === 1 ? 'punto' : 'puntos'}
            </span>
        </>
    );

    /** Controles flotantes inferiores (deshacer + limpiar) — se colocan sobre el wrapper relativo */
    const bottomControls = (
        <div className="absolute bottom-3 left-3 z-[9999] flex items-center gap-2 pointer-events-none">
            <button
                type="button"
                onClick={handleUndo}
                disabled={!hasCoords}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-white border border-teal-200 rounded-full px-3 py-1.5 shadow-sm transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-teal-50 pointer-events-auto"
            >
                <ArrowUturnLeftIcon className="w-3.5 h-3.5" />
                Deshacer
            </button>
            <button
                type="button"
                onClick={handleClear}
                disabled={!hasCoords}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-full px-3 py-1.5 shadow-sm transition-all
                    disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-red-50 pointer-events-auto"
            >
                <TrashIcon className="w-3.5 h-3.5" />
                Limpiar
            </button>
        </div>
    );

    return (
        <div className="space-y-3">
            {/* Título + descripción en la misma línea */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-teal-700">Traza tu ruta en el mapa</h2>
                <p className="text-gray-500 text-sm pt-1.5">
                    Añade puntos al recorrido.
                </p>
            </div>

            {/* ExpandableMap — el collapsed siempre en DOM, sin placeholder div */}
            <ExpandableMap
                headerOffset={62}
                className="relative w-full h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-sm"
                expandTrigger={(onExpand) => (
                    <div className="absolute top-3 right-3 z-[9999] flex items-center gap-2 pointer-events-none">
                        {statusBadges}
                        <button
                            type="button"
                            onClick={onExpand}
                            title="Ampliar mapa"
                            className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors pointer-events-auto"
                        >
                            <ArrowsPointingOutIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                shrinkTrigger={(onShrink) => (
                    <div className="absolute top-3 right-3 z-[9999] flex items-center gap-2 pointer-events-none">
                        {statusBadges}
                        <button
                            type="button"
                            onClick={onShrink}
                            title="Contraer mapa"
                            className="inline-flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:bg-gray-50 transition-colors pointer-events-auto"
                        >
                            <ArrowsPointingInIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}
                collapsed={
                    <>
                        {bottomControls}
                        <MapContainer
                            key={collapsedKey}
                            center={mapCenter}
                            zoom={mapZoom}
                            style={{ height: '100%', width: '100%' }}
                            className="z-0"
                            scrollWheelZoom={true}
                            dragging={true}
                        >
                            {mapContents(false)}
                        </MapContainer>
                    </>
                }
                expanded={
                    <>
                        {bottomControls}
                        <MapContainer
                            key="map-expanded"
                            center={mapCenter}
                            zoom={mapZoom}
                            style={{ height: '100%', width: '100%' }}
                            className="z-0"
                            scrollWheelZoom={true}
                            dragging={true}
                        >
                            {mapContents(true)}
                        </MapContainer>
                    </>
                }
            />

            {/* Errores de validación */}
            {coordError && (
                <p className="text-red-500 text-sm">{coordError}</p>
            )}
            {!coordError && coords.length > 0 && coords.length < 2 && (
                <p className="text-red-500 text-sm">Añade al menos 2 puntos para definir la ruta.</p>
            )}
        </div>
    );
}
