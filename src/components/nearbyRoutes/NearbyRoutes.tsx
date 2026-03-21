'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useFilteredRoutes } from '@/queries/routeQuery';
import { haversineDistanceKm } from '@/shared/utils/distance';
import { ICoordinates, IRoute } from '@/shared/interfaces/entities/route.interface';
import NearbyRouteCard from '@/components/nearbyRoutes/components/NearbyRouteCard';

type GeoState = 'idle' | 'loading' | 'granted' | 'denied' | 'error';

interface IUserCoords {
    lat: number;
    lng: number;
}

interface IRouteWithDistance {
    route: IRoute;
    distanceKm: number;
}

// Distancia máxima en km para considerar una ruta como "cercana"
const MAX_DISTANCIA_CERCANA_KM = 100;

const NearbyRoutes: React.FC = () => {
    const [geoState, setGeoState] = useState<GeoState>('idle');
    const [userCoords, setUserCoords] = useState<IUserCoords | null>(null);
    // Estado para detectar si la geolocalización está soportada en el navegador
    const [supported, setSupported] = useState<boolean>(true);

    const { data: routesData, isLoading: routesLoading } = useFilteredRoutes(
        { limit: 100 },
        undefined,
    );

    // loop: true — scroll infinito
    // align: 'start' — las cards se alinean al borde izquierdo del viewport
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

    const requestGeolocation = () => {
        setGeoState('loading');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setGeoState('granted');
            },
            (err) => {
                setGeoState(err.code === 1 ? 'denied' : 'error');
            },
            { timeout: 10000 },
        );
    };

    // Al montar: verificar soporte y permisos de geolocalización
    useEffect(() => {
        if (!('geolocation' in navigator)) {
            setSupported(false);
            return;
        }

        // Si la API de permisos no está disponible, quedarse en idle
        if (!navigator.permissions) {
            return;
        }

        navigator.permissions
            .query({ name: 'geolocation' })
            .then((result) => {
                if (result.state === 'granted') {
                    requestGeolocation();
                } else if (result.state === 'denied') {
                    setGeoState('denied');
                }
                // 'prompt' → quedarse en idle, esperar interacción del usuario
            })
            .catch(() => {
                // Fallo al consultar permisos → quedarse en idle
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // El navegador no soporta geolocalización → no renderizar el componente
    if (!supported) {
        return null;
    }

    // Calcular rutas cercanas cuando tengamos coordenadas y datos
    let nearbyRoutes: IRouteWithDistance[] = [];
    if (geoState === 'granted' && userCoords !== null && routesData !== undefined) {
        const routes = routesData.routes ?? [];
        nearbyRoutes = routes
            .filter((r) => r.coordinates.length > 0 && r.coordinates[0] !== undefined)
            .map((r) => {
                const coord = r.coordinates[0] as ICoordinates;
                return {
                    route: r,
                    distanceKm: haversineDistanceKm(userCoords, coord),
                };
            })
            .filter(({ distanceKm }) => distanceKm <= MAX_DISTANCIA_CERCANA_KM)
            .sort((a, b) => a.distanceKm - b.distanceKm)
            .slice(0, 8);
    }

    const showLoading = geoState === 'loading' || (geoState === 'granted' && routesLoading);

    return (
        <section className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-1">
                Cerca de ti
            </h2>
            <p className="text-gray-500 mb-5">Rutas que puedes empezar hoy</p>

            {/* Permiso denegado */}
            {geoState === 'denied' && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2 text-amber-700">
                        <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                            Has denegado el acceso a tu ubicación. Para ver rutas cercanas,
                            activa los permisos de localización en la configuración de tu navegador.
                        </p>
                    </div>
                    <button
                        onClick={requestGeolocation}
                        className="self-start flex items-center gap-2 px-5 py-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-semibold rounded-full transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Error al obtener ubicación */}
            {geoState === 'error' && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2 text-red-600">
                        <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">
                            No pudimos obtener tu ubicación. Comprueba tu conexión o los permisos del navegador.
                        </p>
                    </div>
                    <button
                        onClick={requestGeolocation}
                        className="self-start flex items-center gap-2 px-5 py-2 bg-lime-600 hover:bg-lime-700 text-white text-sm font-semibold rounded-full transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* CTA en estado inicial */}
            {geoState === 'idle' && (
                <button
                    onClick={requestGeolocation}
                    className="flex items-center gap-2 px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white font-semibold rounded-full transition-colors"
                >
                    Ver rutas cerca de mí
                </button>
            )}

            {/* Carrusel con estructura relativa para las flechas */}
            {(showLoading || (geoState === 'granted' && !routesLoading)) && (
                <div className="relative">
                    {/* Skeletons de carga — misma estructura de slides para no saltar el layout */}
                    {showLoading && (
                        <div className="flex -ml-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="flex-none w-1/2 sm:w-1/3 lg:w-1/4 pl-4">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-full aspect-square rounded-full bg-zinc-200 animate-pulse" />
                                        <div className="flex gap-1.5">
                                            <div className="h-5 w-16 rounded-full bg-zinc-200 animate-pulse" />
                                            <div className="h-5 w-12 rounded-full bg-zinc-200 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Estado vacío tras cargar */}
                    {geoState === 'granted' && !routesLoading && nearbyRoutes.length === 0 && (
                        <p className="text-gray-400 italic">
                            No encontramos rutas con coordenadas cercanas a tu ubicación.
                        </p>
                    )}

                    {/* Flecha izquierda — solo en desktop */}
                    <button
                        onClick={() => emblaApi?.scrollPrev()}
                        aria-label="Anterior"
                        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-600 hover:bg-lime-50 hover:border-lime-400 absolute -left-5 top-1/2 -translate-y-1/2 z-10 transition-colors"
                    >
                        <ChevronLeftIcon className="w-5 h-5" />
                    </button>

                    {/* Flecha derecha — solo en desktop */}
                    <button
                        onClick={() => emblaApi?.scrollNext()}
                        aria-label="Siguiente"
                        className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-600 hover:bg-lime-50 hover:border-lime-400 absolute -right-5 top-1/2 -translate-y-1/2 z-10 transition-colors"
                    >
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>

                    {/* Carrusel Embla */}
                    {!showLoading && nearbyRoutes.length > 0 && (
                        // Fade-in suave al reemplazar el skeleton — motion.div envuelve todo el carrusel,
                        // no las cards individuales, así no hay riesgo de cards invisibles si la animación se interrumpe
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            {/* Viewport: overflow-hidden requerido por Embla para ocultar slides clonados del loop */}
                            <div ref={emblaRef} className="overflow-hidden">
                                {/*
                                    Container: -ml-4 compensa el pl-4 de cada slide.
                                    Esto garantiza que el gap entre el último y primer slide del loop
                                    sea exactamente igual que entre cualquier otro par de slides (pl-4 = 16px).
                                */}
                                <div className="flex -ml-4">
                                    {nearbyRoutes.map(({ route, distanceKm }) => (
                                        /*
                                            Slide: pl-4 es el gap.
                                            Responsive: 2 cards en mobile, 3 en sm, 4 en lg.
                                            w-1/2 en mobile muestra borde de la siguiente card.
                                        */
                                        <div key={route.idRoute} className="flex-none w-1/2 sm:w-1/3 lg:w-1/4 pl-4">
                                            <NearbyRouteCard route={route} distanceKm={distanceKm} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </section>
    );
};

export default NearbyRoutes;
