'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPinIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useActiveSession } from '@/queries/routeSessionQuery';
import { useDeleteSession } from '@/mutations/routeSessionMutation';
import { getElapsedSeconds, formatElapsed } from '@/shared/utils/sessionDate';
import { useAuth } from '@/hooks/useAuth';

export default function ActiveSessionBanner() {
    const pathname = usePathname();
    const { currentUser } = useAuth();
    const { data: session, isLoading } = useActiveSession();
    const { mutate: deleteSession, isPending: isDeleting } = useDeleteSession();
    const [elapsed, setElapsed] = useState<number>(0);

    // Cronómetro que se actualiza cada segundo mientras hay sesión activa
    useEffect(() => {
        if (!session) return;
        setElapsed(getElapsedSeconds(session.startAt));

        const interval = setInterval(() => {
            setElapsed(getElapsedSeconds(session.startAt));
        }, 1000);
        return () => clearInterval(interval);
    // Solo reiniciar si cambia la sesión o su fecha de inicio, no en cada refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.idSession, session?.startAt]);

    // No renderizar si no está autenticado, está cargando, no hay sesión, o ya estamos en el tracker
    if (!currentUser.isAuthenticated || isLoading || !session || pathname === '/tracking') return null;

    const handleDiscard = () => {
        if (window.confirm('¿Seguro que quieres descartar esta salida? Se eliminará sin guardar.')) {
            deleteSession(session.idSession);
        }
    };

    return (
        <div className="w-full bg-lime-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 z-40">
            <div className="flex items-center gap-2 min-w-0">
                <MapPinIcon className="w-5 h-5 flex-shrink-0 animate-pulse" />
                <span className="text-sm font-semibold truncate">
                    Salida en curso
                </span>
                <span className="text-base font-mono text-lime-100 flex-shrink-0 leading-none pt-1 pl-2">
                    {formatElapsed(elapsed)}
                </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Botón para volver a la ruta y abrir el modal del tracker */}
                <Link
                    href="/tracking"
                    className="flex items-center gap-1 bg-white text-lime-700 text-xs font-bold px-3 py-1.5 rounded-full hover:text-lime-800 transition-colors"
                >
                    <PlayIcon className="w-3.5 h-3.5" />
                    Retomar
                </Link>

                {/* Descartar sesión */}
                <button
                    onClick={handleDiscard}
                    disabled={isDeleting}
                    aria-label="Descartar salida"
                    className="p-1.5 rounded-full hover:bg-lime-700 transition-colors disabled:opacity-50"
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
