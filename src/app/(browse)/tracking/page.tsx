'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { StopIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon, MapPinIcon, SignalIcon } from '@heroicons/react/24/outline';
import { useActiveSession } from '@/queries/routeSessionQuery';
import { useRoute } from '@/queries/routeQuery';
import { useStartSession } from '@/mutations/routeSessionMutation';
import { useEndSession } from '@/mutations/routeSessionMutation';
import { getElapsedSeconds, formatElapsed } from '@/shared/utils/sessionDate';
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
import { haversineDistanceMeters, formatDistance } from '@/shared/utils/distance';
import { GPS_ACCURACY_THRESHOLD_METERS } from '@/services/routeSessionService';

// SessionTrackerMap usa Leaflet, que necesita window/document — solo se carga en el navegador
const SessionTrackerMap = dynamic(
    () => import('@/components/sessionTracker/SessionTrackerMap'),
    {
        loading: () => (
            <div className="w-full h-full flex items-center justify-center bg-stone-100">
                <span className="text-sm text-gray-500">Cargando mapa…</span>
            </div>
        ),
        ssr: false,
    },
);

/** Distancia máxima al inicio de la ruta para llamar a startSession (metros) */
const START_PROXIMITY_METERS = 50;

export default function TrackingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // slug puede venir de la URL (nuevo tracking) o de la sesión activa (retomar)
    const slugFromUrl = searchParams.get('slug') ?? '';

    const { data: session, isLoading: isLoadingSession, isFetching: isFetchingSession } = useActiveSession();
    const routeSlug = session?.slug ?? slugFromUrl;
    const { data: route, isLoading: isLoadingRoute } = useRoute(routeSlug);
    const { mutate: startSession, isPending: isStarting } = useStartSession();
    const { mutate: endSession, isPending: isEnding, error: endError } = useEndSession();

    // --- Guards de navegación ---
    const hadSessionRef = useRef(false);
    const isLeavingRef = useRef(false);

    // Redirigir a /routes si no hay slug (acceso directo sin ruta)
    useEffect(() => {
        if (isLeavingRef.current) return;
        if (!isLoadingSession && !isFetchingSession && !slugFromUrl && !session) {
            router.replace('/routes');
        }
    }, [isLoadingSession, isFetchingSession, slugFromUrl, session, router]);

    // Redirigir si teníamos sesión y desapareció externamente (no por nuestra acción)
    useEffect(() => {
        if (session) hadSessionRef.current = true;
    }, [session]);
    useEffect(() => {
        if (isLeavingRef.current) return;
        if (hadSessionRef.current && !isLoadingSession && !isFetchingSession && !session) {
            router.replace('/routes');
        }
    }, [isLoadingSession, isFetchingSession, session, router]);

    // --- Cronómetro desde session.startAt (igual que el banner) ---
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        if (!session) return;
        setElapsed(getElapsedSeconds(session.startAt));
        const interval = setInterval(() => {
            setElapsed(getElapsedSeconds(session.startAt));
        }, 1000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.idSession, session?.startAt]);

    // --- GPS y distancias ---
    const [distanceCovered, setDistanceCovered] = useState<number>(0);
    const [distanceToStart, setDistanceToStart] = useState<number | null>(null);
    const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
    const prevGpsRef = useRef<{ lat: number; lng: number } | null>(null);
    // Evitar llamar a startSession más de una vez aunque el GPS dispare varias veces
    const startCalledRef = useRef(false);

    const handlePositionUpdate = useCallback(
        (lat: number, lng: number, accuracy: number) => {
            setGpsAccuracy(accuracy);
            if (!route?.coordinates?.length) return;

            const startCoord = route.coordinates[0];
            const dToStart = haversineDistanceMeters(lat, lng, startCoord.lat, startCoord.lng);
            setDistanceToStart(dToStart);

            // Llamar a startSession automáticamente cuando el usuario está en el inicio
            if (!session && !startCalledRef.current && dToStart <= START_PROXIMITY_METERS) {
                startCalledRef.current = true;
                startSession(route.idRoute);
            }

            // Acumular distancia solo cuando la sesión ya está activa
            if (session && prevGpsRef.current !== null) {
                const step = haversineDistanceMeters(
                    prevGpsRef.current.lat,
                    prevGpsRef.current.lng,
                    lat,
                    lng,
                );
                // Descartar saltos > 50 m (pérdida momentánea de señal GPS)
                if (step < 50) {
                    setDistanceCovered((prev) => prev + step);
                }
            }

            prevGpsRef.current = { lat, lng };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [session, route?.coordinates, route?.idRoute],
    );

    // --- Handlers ---
    // Capturamos el slug antes de que la sesión desaparezca del cache al finalizar
    const routeSlugRef = useRef<string | null>(null);
    useEffect(() => {
        if (session?.slug) routeSlugRef.current = session.slug;
    }, [session?.slug]);

    const handleEnd = () => {
        if (!session) return;
        const slug = routeSlugRef.current ?? session.slug;
        const idSession = session.idSession;
        isLeavingRef.current = true;
        endSession(idSession, {
            onSuccess: () => {
                router.push(`/route/${slug}?checkin=${idSession}`);
            },
            onError: () => {
                isLeavingRef.current = false;
            },
        });
    };

    // --- Skeleton: solo mientras carga la ruta ---
    if (isLoadingRoute || !route) {
        return (
            <div className="relative" style={{ height: 'calc(100dvh - 60px)' }}>
                <div className="absolute inset-0 bg-stone-100 animate-pulse" />
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-stone-200/40 animate-pulse">
                    <div className="w-8 h-8 bg-stone-200 rounded-full" />
                    <div className="flex flex-col items-center gap-1">
                        <div className="w-20 h-3 bg-stone-200 rounded" />
                        <div className="w-32 h-4 bg-stone-200 rounded" />
                    </div>
                    <div className="w-20 h-8 bg-stone-200 rounded-full" />
                </div>
            </div>
        );
    }

    // Header rojo = sin sesión activa (usuario aún no está en el inicio)
    const headerIsRed = !session;

    return (
        <div className="relative" style={{ height: 'calc(100dvh - 60px)' }}>

            {/* Mapa GPS — ocupa todo el área disponible */}
            <div className="absolute inset-0">
                <SessionTrackerMap
                    routeCoordinates={route.coordinates}
                    onPositionUpdate={handlePositionUpdate}
                />
            </div>

            {/* Header flotante con transparencia sobre el mapa */}
            <div className="absolute top-0 left-0 right-0 z-10">

                {/* Barra principal */}
                <div className={`
                    flex items-center justify-between px-4 py-2
                    border-b backdrop-blur-sm transition-colors duration-300
                    ${headerIsRed
                        ? 'bg-red-600/80 border-red-500/30'
                        : 'bg-white/80 border-stone-200/40'
                    }
                `}>
                    {/* Botón volver */}
                    <button
                        onClick={() => router.push(`/route/${route.slug}`)}
                        aria-label="Volver a la ruta"
                        className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${
                            headerIsRed
                                ? 'hover:bg-black/20 text-white'
                                : 'hover:bg-black/15 text-gray-600'
                        }`}
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>

                    {/* Centro: nombre + estado */}
                    <div className="flex flex-col items-center min-w-0 px-2 flex-1">
                        <span className={`text-xs font-semibold uppercase tracking-wider ${
                            headerIsRed ? 'text-red-100' : 'text-teal-600'
                        }`}>
                            {isStarting
                                ? 'Iniciando salida…'
                                : session
                                    ? 'Salida en curso'
                                    : 'Acércate al inicio'
                            }
                        </span>

                        <span className={`text-sm font-semibold truncate max-w-[250px] ${
                            headerIsRed ? 'text-white' : 'text-gray-800'
                        }`}>
                            {CapitalizeFirstLetter(route.title)}
                        </span>

                        {/* Cronómetro + distancia — solo cuando hay sesión activa */}
                        {session && (
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-lg font-black font-mono text-gray-900 tabular-nums leading-none">
                                    {formatElapsed(elapsed)}
                                </span>
                                <span className="text-xs font-semibold text-teal-600">
                                    {formatDistance(distanceCovered)}
                                </span>
                            </div>
                        )}

                        {/* Distancia al inicio — mientras no hay sesión */}
                        {!session && distanceToStart !== null && (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-100 mt-0.5">
                                <MapPinIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                A {formatDistance(distanceToStart)} del inicio
                            </span>
                        )}
                    </div>

                    {/* Botón Finalizar — solo visible con sesión activa */}
                    {session && (
                        <button
                            onClick={handleEnd}
                            disabled={isEnding}
                            aria-label="Finalizar salida"
                            className="
                                flex items-center gap-1.5 px-3 py-2 rounded-full
                                text-xs font-bold transition-colors flex-shrink-0
                                bg-red-600 hover:bg-red-700 text-white
                                disabled:opacity-50 disabled:cursor-not-allowed
                            "
                        >
                            <StopIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {isEnding ? 'Finalizando…' : 'Finalizar'}
                            </span>
                        </button>
                    )}

                    {/* Placeholder para mantener el layout cuando no hay botón Finalizar */}
                    {!session && <div className="w-9 flex-shrink-0" />}
                </div>

                {/* Error al finalizar — bajo la barra principal */}
                {endError && (
                    <div className="px-4 py-2 bg-red-50/90 backdrop-blur-sm border-b border-red-100">
                        <p className="text-xs text-red-600 text-center">
                            Error al finalizar. Inténtalo de nuevo.
                        </p>
                    </div>
                )}

                {/* Badge de precisión GPS — fluye bajo la barra del header, sobre el mapa */}
                {gpsAccuracy !== null && (
                    <div className="flex justify-end pr-3 pt-2 pointer-events-none">
                        <div className={`
                            flex items-center gap-1.5 px-2.5 py-1 rounded-full
                            text-xs font-semibold shadow-md bg-white/90 pointer-events-auto
                            ${gpsAccuracy <= GPS_ACCURACY_THRESHOLD_METERS ? 'text-teal-700' : 'text-amber-700'}
                        `}>
                            <SignalIcon className="w-3.5 h-3.5" />
                            ±{gpsAccuracy} m
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
