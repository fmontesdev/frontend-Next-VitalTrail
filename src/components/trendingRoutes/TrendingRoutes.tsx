'use client'

import React from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useTrendingRoutes } from '@/queries/routeQuery';
import TrendingRouteCard from '@/components/trendingRoutes/components/TrendingRouteCard';

const TrendingRoutes: React.FC = () => {
    const { data: routes, isLoading, isError, refetch } = useTrendingRoutes();

    // loop: true — scroll infinito
    // align: 'start' — las cards se alinean al borde izquierdo del viewport
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

    return (
        <section className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-1">
                Rutas en tendencia
            </h2>
            <p className="text-gray-500 mb-5">Las más exploradas por la comunidad</p>

            <div className="relative">
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

                {/* Estado de carga — misma estructura de slides para no saltar el layout */}
                {isLoading && (
                    <div className="flex -ml-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="flex-none w-4/5 sm:w-1/2 lg:w-1/4 pl-4">
                                <div className="h-[300px] rounded-2xl bg-zinc-200 animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Estado de error */}
                {isError && !isLoading && (
                    <div className="flex flex-col items-center gap-3 py-10 text-zinc-500">
                        <p>No pudimos cargar las rutas en tendencia.</p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 text-sm font-semibold text-teal-600 border border-teal-300 rounded-full hover:bg-teal-50 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Estado vacío */}
                {!isLoading && !isError && routes !== undefined && routes.length === 0 && (
                    <p className="text-gray-400 italic">
                        No hay rutas disponibles en este momento.
                    </p>
                )}

                {/* Carrusel Embla */}
                {!isLoading && !isError && routes !== undefined && routes.length > 0 && (
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
                                {routes.map((route) => (
                                    /*
                                        Slide: pl-4 es el gap.
                                        Responsive: 1 card en mobile, 2 en sm, 4 en lg.
                                        w-4/5 en mobile muestra el borde de la siguiente card
                                        para indicar que hay más contenido.
                                    */
                                    <div key={route.idRoute} className="flex-none w-4/5 sm:w-1/2 lg:w-1/4 pl-4">
                                        <TrendingRouteCard route={route} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default TrendingRoutes;
