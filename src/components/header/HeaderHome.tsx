'use client';

import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { useIsPremium, useIsAdmin } from '@/auth/authorizations';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { GetTokenCookie } from '@/auth/clientCookies';
import Search from '../search/Search';
import MobileMenuHome from './MobileMenuHome';
import StatsStrip from '../statsStrip/StatsStrip';
import { Bars4Icon } from "@heroicons/react/24/outline";
import { merienda } from '@/app/fonts';
import { getImageUrl } from '@/shared/utils/imageUrl';

export default function HeaderHome() {
    const router = useRouter();
    const refreshToken = GetTokenCookie('refreshToken');
    const { currentUser, logout } = useAuth();
    const isPremium = useIsPremium();
    const isAdmin = useIsAdmin();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <header className="relative w-full h-[280px] md:h-[300px] text-base">
                {/* Imagen de fondo */}
                <div className="absolute inset-0">
                    <Image
                        src={getImageUrl('background', 'header_home.png')}
                        alt="Header de VitalTrail"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    {/* Capa de oscurecimiento */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                <div className="relative z-10 h-full flex flex-col">
                    {/* Primera fila: Logo + Links */}
                    <div className="container mx-auto flex justify-between items-center pt-4 px-5">
                        {/* Logo */}
                        <Link href="/" aria-label="Inicio" onClick={() => localStorage.removeItem('searchQuery')}>
                            <span className={`${merienda.className} antialiased text-3xl font-black text-white`}>
                                <span className="text-lime-400">Vital</span>
                                <span className="text-teal-400">Trail</span>
                            </span>
                        </Link>

                        {/* Links de navegación (ocultos en móvil) */}
                        <nav className={clsx(
                            'hidden md:flex items-center space-x-8 font-bold',
                            'transition-opacity duration-300 ease-in',
                            isVisible ? 'opacity-100' : 'opacity-0'
                        )}>
                            {isVisible && (
                                <>
                                    {!isPremium && (
                                        <Link href="/premium" className="text-white hover:text-lime-400">
                                            Pásate a Premium
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <Link href="/admin" className="text-white hover:text-lime-400">
                                            Panel Admin
                                        </Link>
                                    )}

                                    {currentUser.isAuthenticated ? (
                                        <>
                                            <button
                                                onClick={handleLogout}
                                                className="text-white hover:text-lime-400"
                                            >
                                                Cierra sesión
                                            </button>
                                            <Link
                                                href={`/profile/${currentUser.user?.username}`}
                                                className="flex items-center gap-2 border-2 rounded-full pr-4 text-white bg-black/30 hover:text-lime-400 hover:border-lime-400"
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
                                        <Link href="/login" className="border-2 rounded-full px-4 py-1 text-white hover:text-lime-400 hover:border-lime-400 hover:bg-black/25">
                                            Inicia sesión
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>

                        {/* Menú hamburguesa en móvil */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                aria-label="Abrir menú"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <Bars4Icon className="h-6 w-6 text-white font-extrabold" />
                            </button>
                        </div>
                    </div>

                    {/* Segunda fila: Texto + Search */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center pb-4 px-6">
                        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg text-center">
                            Mueve tu cuerpo,{' '}
                            <span className="bg-gradient-to-r from-lime-400 to-teal-400 bg-clip-text text-transparent">
                                libera tu mente
                            </span>
                        </h1>

                        <div className="mt-8 w-full max-w-lg relative font-medium">
                            <Search />
                        </div>
                    </div>
                </div>
            </header>

            {/* Franja de estadísticas */}
            <StatsStrip />

            {/* Componente del menú móvil separado */}
            <MobileMenuHome
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                currentUser={currentUser}
                isPremium={isPremium}
                onLogout={handleLogout}
            />
        </>
    );
}
