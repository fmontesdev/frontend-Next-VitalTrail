'use client'

import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { IMobileMenuProps } from '@/shared/interfaces/props/props.interface';

export default function MobileMenu({isOpen, onClose, currentUser, onLogout }: IMobileMenuProps) {
    return (
        <>
            {/* Fondo oscuro detrás del menú */}
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity z-50 ${
                    isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
                onClick={onClose}
            ></div>

            {/* Menú lateral */}
            <aside
                className={`fixed top-0 right-0 w-64 h-full bg-white shadow-lg transform transition-transform z-50 font-medium ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Botón de cierre */}
                <button
                    className="
                        absolute top-4 right-4 text-gray-500 rounded-full p-1
                        bg-gray-100 hover:text-white hover:bg-red-300"
                    onClick={onClose}
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Enlaces de navegación */}
                <nav className="flex flex-col items-start space-y-4 mt-16 px-6 text-base">
                    {currentUser.isAuthenticated ? (
                        <>
                            <Link
                                href={`/profile/${currentUser.user?.username}`}
                                className="flex items-center gap-2 text-gray-500 hover:text-lime-600
                            ">
                                <Image
                                    src={`/avatar/${currentUser.user!.imgUser}`}
                                    alt={currentUser.user!.username}
                                    width={32}
                                    height={32}
                                />
                                {currentUser.user?.name}
                            </Link>
                            <button
                                onClick={() => { onLogout(); onClose(); }}
                                className="text-gray-500 hover:text-lime-600"
                            >
                                Cierra sesión
                            </button>
                        </>
                    ) : (
                        <Link href="/login" onClick={onClose} className="text-gray-500 hover:text-lime-600">
                            Inicia sesión
                        </Link>
                    )}
                    {/* <Link href="/subir" className="text-gray-500 hover:text-lime-600" onClick={onClose}>
                        Sube tus rutas
                    </Link>
                    <Link href="/premium" className="text-gray-500 hover:text-lime-600" onClick={onClose}>
                        Pásate a Premium
                    </Link> */}
                </nav>
            </aside>
        </>
    );
}
