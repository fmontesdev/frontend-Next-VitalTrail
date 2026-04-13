'use client';

import { useRef, useEffect } from 'react';
import { useInfiniteMyRoutes } from '@/queries/routeQuery';
import ProfileRouteCard from './ProfileRouteCard';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { ExclamationTriangleIcon, MapIcon } from '@heroicons/react/24/outline';

export default function MyRoutesList({ username }: { username: string }) {
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMyRoutes(username);

    // scrollContainerRef eliminado: el scroll vive en el contenedor padre (ProfileMyContent).
    // sentinelRef es un div invisible situado al final de la lista.
    // Cuando el usuario hace scroll y este div entra en el área visible del contenedor,
    // el observer dispara fetchNextPage() para cargar el siguiente lote de rutas.
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Aplanamos todas las páginas cargadas en un único array de rutas.
    const routes = data?.pages.flatMap((p) => p.routes) ?? [];

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        // root: null → usa el viewport global (el scroll vive en ProfileMyContent).
        // threshold: 0.1 → se dispara cuando al menos el 10% del sentinel es visible.
        const observer = new IntersectionObserver(
            (entries) => {
                // Solo pedimos la siguiente página si hay más datos y no hay una petición en curso.
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { root: null, threshold: 0.1 }
        );

        observer.observe(sentinel);
        // Limpieza: desconectamos el observer al desmontar o cuando cambian las dependencias.
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[1, 2].map((_, index) => (
                <div key={index} className="flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden animate-pulse">
                    <div className="h-44 w-full bg-stone-200" />
                    <div className="p-3 flex flex-col gap-2">
                        <div className="w-3/4 h-4 bg-stone-200 rounded-lg" />
                        <div className="flex gap-1.5">
                            <div className="w-12 h-5 bg-stone-200 rounded-full" />
                            <div className="w-16 h-5 bg-stone-200 rounded-full" />
                            <div className="w-14 h-5 bg-stone-200 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (isError) return (
        <div className="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Hubo un error al cargar las rutas</span>
        </div>
    );

    if (routes.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
            <MapIcon className="w-12 h-12 mb-3" />
            <span className="text-sm font-medium">No tienes rutas creadas todavía</span>
        </div>
    );

    return (
        // max-h y overflow eliminados: el scroll vive en el contenedor padre (ProfileMyContent)
        <div className="w-full py-2 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {routes.map((route: IRoute) => (
                    <ProfileRouteCard key={route.idRoute} route={route} />
                ))}
            </div>

            {/* Spinner incremental para páginas subsiguientes */}
            {isFetchingNextPage && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    {[1, 2].map((_, index) => (
                        <div key={index} className="flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-44 w-full bg-stone-200" />
                            <div className="p-3 flex flex-col gap-2">
                                <div className="w-3/4 h-4 bg-stone-200 rounded-lg" />
                                <div className="flex gap-1.5">
                                    <div className="w-12 h-5 bg-stone-200 rounded-full" />
                                    <div className="w-16 h-5 bg-stone-200 rounded-full" />
                                    <div className="w-14 h-5 bg-stone-200 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Sentinel: div invisible al final de la lista. El IntersectionObserver lo vigila;
                cuando entra en el área visible del contenedor con scroll, se carga la siguiente página. */}
            <div ref={sentinelRef} className="h-4" />
        </div>
    );
}
