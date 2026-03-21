'use client';

import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { useIsPremium } from '@/auth/authorizations';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { GetTokenCookie } from '@/auth/clientCookies';
import Search from '../search/Search';
import { merienda } from '@/app/fonts';
import { getImageUrl } from '@/shared/utils/imageUrl';

export default function Header() {
    const router = useRouter();
    const refreshToken = GetTokenCookie('refreshToken');
    const { currentUser, logout } = useAuth();
    const isPremium = useIsPremium();

    // Renderización suspensiva para evitar parpadeos
    const [isVisible, setIsVisible] = useState(false);

    // Hacemos que la UI aparezca gradualmente
    useEffect(() => {
        if (!currentUser.isLoading) {
            // Solo mostramos la UI cuando ha terminado de cargar
            setIsVisible(true);
        }
    }, [currentUser.isLoading]);

    const handleLogout = () => {
        if (refreshToken !== null) {
            // console.log(refreshToken);
            logout.mutateAsync(refreshToken);
            router.push('/');
        }
    };

    return (
        <>
            <header className="relative flex flex-col justify-center w-full h-[64px] md:h-[64px] text-base border border-stone-">
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
                        "hidden md:flex items-center space-x-8 font-bold",
                        "transition-opacity duration-300 ease-in",
                        isVisible ? "opacity-100" : "opacity-0"
                    )}>
                        {isVisible && (
                            <>
                                {!isPremium  && (
                                    <Link href="/premium" className="text-lime-500 hover:text-lime-600 transition duration-200 ease-in-out">
                                        Pásate a Premium
                                    </Link>
                                )}

                                {currentUser.isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={handleLogout}
                                            className="text-lime-500 hover:text-lime-600 transition duration-200 ease-in-out"
                                        >
                                            Cierra sesión
                                        </button>
                                        <Link
                                            href={`/profile/${currentUser.user?.username}`}
                                            className="flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full pr-4
                                                text-lime-500 hover:text-white hover:bg-stone-300 transition duration-200 ease-in-out"
                                        >
                                            <Image
                                                src={getImageUrl('avatar', currentUser.user!.imgUser)}
                                                alt={currentUser.user!.username}
                                                width={32}
                                                height={32}
                                                sizes="40px"
                                            />
                                            {currentUser.user?.name}
                                        </Link>
                                    </>
                                ) : (
                        <Link
                                href="/login"
                                className="bg-lime-600 border-2 border-lime-600 rounded-full px-4 py-1 text-white
                                    hover:bg-lime-700 hover:border-lime-700 transition durantion-200 ease-in-out"
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
