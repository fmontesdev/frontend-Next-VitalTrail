'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useIsPremium } from '@/auth/authorizations';
import { GetTokenCookie } from '@/auth/clientCookies';
import UserMenu from '@/components/header/UserMenu';

export default function AdminTopbar() {
    const router = useRouter();
    const { currentUser, logout } = useAuth();
    const isPremium = useIsPremium();
    const refreshToken = GetTokenCookie('refreshToken');

    const handleLogout = () => {
        if (refreshToken !== null) {
            logout.mutateAsync(refreshToken);
            router.push('/');
        }
    };

    if (!currentUser.isAuthenticated || !currentUser.user) return null;

    return (
        <header className="bg-white border-b border-stone-200 px-8 py-3 flex justify-end items-center">
            <UserMenu
                user={currentUser.user}
                isAdmin={true}
                isPremium={!!isPremium}
                onLogout={handleLogout}
                context="admin"
                variant="default"
            />
        </header>
    );
}
