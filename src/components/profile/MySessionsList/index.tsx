'use client';

import { useRef, useEffect, useState } from 'react';
import { useInfiniteSessionsList } from '@/queries/routeSessionQuery';
import SessionCard from './components/SessionCard';
import { IRouteSessionSummary } from '@/shared/interfaces/entities/routeSession.interface';
import { ExclamationTriangleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';

export default function MySessionsList() {
    const {
        data,
        isLoading,
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteSessionsList();

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [hasScroll, setHasScroll] = useState(false);

    const sessions = data?.pages.flatMap((p) => p.sessions) ?? [];

    // Detecta si el contenedor tiene scroll vertical activo
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const checkScroll = () => {
            setHasScroll(container.scrollHeight > container.clientHeight);
        };

        checkScroll();

        const observer = new ResizeObserver(checkScroll);
        observer.observe(container);
        return () => observer.disconnect();
    }, [sessions.length]);

    // IntersectionObserver para infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current;
        const root = scrollContainerRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { root, threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) return (
        <div className="flex flex-col gap-3 w-full">
            {[1, 2, 3].map((_, index) => (
                <div
                    key={index}
                    className="h-[72px] bg-stone-200 rounded-xl animate-pulse"
                />
            ))}
        </div>
    );

    if (isError) return (
        <div className="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Hubo un error al cargar las sesiones</span>
        </div>
    );

    if (sessions.length === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
            <CalendarDaysIcon className="w-12 h-12 mb-3" />
            <span className="text-sm font-medium">No tienes sesiones registradas</span>
        </div>
    );

    return (
        <div ref={scrollContainerRef} className="w-full py-2 animate-fade-in max-h-[616px] overflow-y-auto">
            <div className={`flex flex-col gap-3 ${hasScroll ? 'pr-4' : ''}`}>
                {sessions.map((session: IRouteSessionSummary) => (
                    <SessionCard key={session.idSession} session={session} />
                ))}
            </div>

            {/* Skeletons incremental mientras se carga la siguiente página */}
            {isFetchingNextPage && (
                <div className="flex flex-col gap-3 mt-3">
                    {[1, 2].map((_, index) => (
                        <div
                            key={index}
                            className="h-[72px] bg-stone-200 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            )}

            {/* Sentinel: el IntersectionObserver lo vigila para disparar fetchNextPage */}
            <div ref={sentinelRef} className="h-4" />
        </div>
    );
}
