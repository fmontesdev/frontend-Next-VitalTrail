'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function useAdminGuard() {
    const router = useRouter();
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser.isLoading) return;

        if (!currentUser.isAuthenticated) {
            router.replace('/login');
            return;
        }

        if (currentUser.user?.rol !== 'ROLE_ADMIN') {
            router.replace('/');
        }
    }, [currentUser, router]);

    return currentUser;
}
