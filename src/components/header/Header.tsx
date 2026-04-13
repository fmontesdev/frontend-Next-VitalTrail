'use client';

import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { useIsPremium, useIsAdmin } from '@/auth/authorizations';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { GetTokenCookie } from '@/auth/clientCookies';
import Search from '../search/Search';
import UserMenu from './UserMenu';
import NotificationBell from '../NotificationBell';
import { merienda } from '@/app/fonts';

export default function Header() {
    const router = useRouter();
    const refreshToken = GetTokenCookie('refreshToken');
    const { currentUser, logout } = useAuth();
    const isPremium = useIsPremium();
    const isAdmin = useIsAdmin();

    // Renderización suspensiva para evitar parpadeos
    const [isVisible, setIsVisible] = useState(false);

    // Hacemos que la UI aparezca gradualmente
    useEffect(() => {
        if (!currentUser.isLoading) {
            setIsVisible(true);
        }
    }, [currentUser.isLoading]);

    const handleLogout = () => {
        if (refreshToken !== null) {
            logout.mutateAsync(refreshToken);
            router.push('/');
        }
    };

    return (
        <>
            <header className="relative flex flex-col justify-center w-full h-[64px] md:h-[64px] text-base border border-stone-" style={{ zIndex: 500 }}>
                {/* Primera fila: Logo + Links */}
                <div className="container mx-auto flex justify-between items-center px-5">
                    {/* Logo */}
                    <Link href="/" aria-label="Inicio" onClick={() => localStorage.removeItem('searchQuery')}>
                        <span className={`${merienda.className} antialiased text-3xl font-black text-white`}>
                            <span className="text-lime-500">Vital</span>
                            <span className="text-teal-500">Trail</span>
                        </span>
                    </Link>

                    {/* Search */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
                        <div className="w-full max-w-lg relative font-medium">
                            <Search />
                        </div>
                    </div>

                    {/* Links de navegación */}
                    <nav className={clsx(
                        'hidden md:flex items-center space-x-8 font-bold',
                        'transition-opacity duration-300 ease-in',
                        isVisible ? 'opacity-100' : 'opacity-0'
                    )}>
                        {isVisible && (
                            <>
                                {currentUser.isAuthenticated ? (
                                    <div className="flex items-center gap-2">
                                        {!isPremium && (
                                            <Link
                                                href="/premium"
                                                className="flex items-center gap-1.5 font-semibold text-lime-600 hover:bg-stone-100 px-3 py-2 rounded-full transition-colors"
                                            >
                                                <SparklesIcon className="w-5 h-5" />
                                                Premium
                                            </Link>
                                        )}
                                        <NotificationBell variant="default" />
                                        <UserMenu
                                            user={currentUser.user!}
                                            isAdmin={!!isAdmin}
                                            onLogout={handleLogout}
                                            variant="default"
                                        />
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="bg-lime-600 border-2 border-lime-600 rounded-full px-4 py-1 text-white
                                            hover:bg-lime-700 hover:border-lime-700 transition duration-200 ease-in-out"
                                    >
                                        Inicia sesión
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </div>
            </header>
        </>
    );
}
