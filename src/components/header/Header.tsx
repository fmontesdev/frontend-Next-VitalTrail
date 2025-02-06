'use client';

import React, { useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Search from '../search/Search';
import MobileMenu from './MobileMenu';
import { Bars4Icon } from "@heroicons/react/24/outline";
import { merienda } from '@/app/fonts';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="relative w-full h-[350px] md:h-[500px] text-base">
                {/* Imagen de fondo */}
                <div className="absolute inset-0">
                    <Image
                        src="/header/header-background1.jpg"
                        alt="Fondo de VitalTrail"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Capa de oscurecimiento opcional */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Contenedor con contenido */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Primera fila: Logo + Links */}
                    <div className="container mx-auto flex justify-between items-center py-4 px-5">
                        {/* Logo */}
                        <Link href="/" aria-label="Inicio">
                            <span className={`${merienda.className} antialiased text-3xl font-black text-white`}>
                                <span className="text-lime-400">Vital</span>
                                <span className="text-teal-400">Trail</span>
                            </span>
                        </Link>

                        {/* Links de navegación (ocultos en móvil) */}
                        <nav className="hidden md:flex items-center space-x-8 font-bold">
                            <Link href="/premium" className="text-white hover:text-lime-400">
                                Pásate a Premium
                            </Link>
                            <Link href="/subir" className="text-white hover:text-lime-400">
                                Sube tus rutas
                            </Link>
                            <Link href="/planifica" className="border-2 rounded-full px-4 py-1 text-white hover:text-lime-400 hover:border-lime-400 hover:bg-black/25">
                                Inicia sesión
                            </Link>
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
                    <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
                        {/* Texto */}
                        <h1 className="text-3xl md:text-5xl font-bold text-white">
                            Explora el exterior, equilibra tu interior
                        </h1>

                        {/* Search */}
                        <div className="mt-8 w-full max-w-lg relative font-medium">
                            <Search />
                        </div>
                    </div>
                </div>
            </header>

            {/* Componente del menú móvil separado */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
}
