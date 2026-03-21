'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useIsPremium } from '@/auth/authorizations';

/**
 * Guard que exige autenticación y acceso premium (ROLE_ADMIN o ROLE_CLIENT+isPremium).
 * - Si no está autenticado → redirige a /login
 * - Si está autenticado pero no tiene acceso premium → redirige a /premium
 * - Mientras carga → no redirige (null === loading)
 */
export function usePremiumGuard() {
    const router = useRouter();
    const { currentUser } = useAuth();
    const isPremium = useIsPremium(); // null=cargando, true=ok, false=sin acceso

    useEffect(() => {
        if (currentUser.isLoading || isPremium === null) return;
        if (!currentUser.isAuthenticated) {
            router.push('/login');
            return;
        }
        if (isPremium === false) {
            router.push('/premium');
        }
    }, [currentUser, isPremium, router]);

    return { currentUser, isPremium };
}
