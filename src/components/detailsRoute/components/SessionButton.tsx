'use client';

import { useRouter } from 'next/navigation';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useActiveSession } from '@/queries/routeSessionQuery';
import { ISessionButtonProps } from '@/shared/interfaces/props/sessionTracker.props';

export default function SessionButton({ routeSlug }: ISessionButtonProps) {
    const router = useRouter();
    const { data: activeSession, isLoading: isCheckingActive } = useActiveSession();

    // Si hay sesión activa (en cualquier ruta), el banner ya lo gestiona — no mostrar nada
    if (isCheckingActive || activeSession) return null;

    return (
        <button
            onClick={() => router.push(`/tracking?slug=${routeSlug}`)}
            className="
                flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm
                bg-lime-600 hover:bg-lime-700 text-white transition-colors duration-200
            "
        >
            <PlayIcon className="w-4 h-4" />
            Iniciar salida
        </button>
    );
}
