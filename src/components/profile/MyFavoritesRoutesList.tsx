'use client';

import { useRef, useEffect } from 'react';
import { useInfiniteProfileFavorites } from '@/queries/profileQuery';
import ProfileRouteCard from './ProfileRouteCard';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { ExclamationTriangleIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function ProfileFavoritesList({ username }: { username: string }) {
    const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteProfileFavorites(username);

    // scrollContainerRef apunta al div con overflow-y-auto que actúa como ventana de scroll.
    // Se pasa como `root` al IntersectionObserver para que el umbral de detección
    // se calcule relativo a este contenedor y no al viewport de la ventana.
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // sentinelRef es un div invisible situado al final de la lista.
    // Cuando el usuario hace scroll y este div entra en el área visible del contenedor,
    // el observer dispara fetchNextPage() para cargar el siguiente lote de favoritos.
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Aplanamos todas las páginas cargadas en un único array de rutas favoritas.
    const routes = data?.pages.flatMap((p) => p.favoriteRoutes) ?? [];

    useEffect(() => {
        const sentinel = sentinelRef.current;
        const root = scrollContainerRef.current;
        if (!sentinel) return;

        // root: el contenedor con scroll (no el viewport global).
        // threshold: 0.1 → se dispara cuando al menos el 10% del sentinel es visible.
        const observer = new IntersectionObserver(
            (entries) => {
                // Solo pedimos la siguiente página si hay más datos y no hay una petición en curso.
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { root, threshold: 0.1 }
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
            <span className="font-medium">Hubo un error al cargar los favoritos</span>
        </div>
    );

    if (routes.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
            <HeartIcon className="w-12 h-12 mb-3" />
            <span className="text-sm font-medium">No tienes rutas favoritas todavía</span>
        </div>
    );

    return (
        // max-h-[1056px]: limita el área visible a ~8 cards en grid de 2 columnas (4 filas × 248px + gaps).
        // overflow-y-auto: activa el scroll vertical dentro del contenedor cuando el contenido supera ese límite.
        <div ref={scrollContainerRef} className="w-full py-2 animate-fade-in max-h-[1056px] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {routes.map((route: IRoute) => (
                    <ProfileRouteCard key={route.idRoute} route={route} />
                ))}
            </div>

            {/* Skeleton incremental para páginas subsiguientes */}
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
