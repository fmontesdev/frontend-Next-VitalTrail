'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    ArrowLeftIcon,
    Cog6ToothIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';
import { getImageUrl } from '@/shared/utils/imageUrl';

interface IUserMenuProps {
    user: { username: string; name: string; imgUser: string };
    isAdmin: boolean;
    isPremium: boolean;
    onLogout: () => void;
    variant?: 'default' | 'hero';
    context?: 'site' | 'admin';
}

export default function UserMenu({ user, isAdmin, isPremium, onLogout, variant = 'default', context = 'site' }: IUserMenuProps) {
    const triggerClass = variant === 'hero'
        ? 'flex items-center gap-2 border-2 rounded-full pr-4 text-white bg-black/30 hover:text-lime-400 hover:border-lime-400 transition duration-200 ease-in-out cursor-pointer select-none'
        : 'flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full pr-4 text-lime-500 hover:text-white hover:bg-stone-300 transition duration-200 ease-in-out cursor-pointer select-none';

    return (
        <div className="relative group">

            {/* Trigger — avatar + nombre */}
            <div className={triggerClass}>
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <Image
                        src={getImageUrl('avatar', user.imgUser)}
                        alt={user.username}
                        width={32}
                        height={32}
                        sizes="40px"
                    />
                </div>
                <span>{user.name}</span>
            </div>

            {/* Dropdown panel */}
            <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-stone-200
                rounded-2xl shadow-lg z-50 overflow-hidden py-1.5
                invisible opacity-0 group-hover:visible group-hover:opacity-100
                transition-all duration-150">

                <Link
                    href={`/profile/${user.username}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-stone-600
                        hover:bg-stone-50 transition-colors"
                >
                    <UserCircleIcon className="w-4 h-4 shrink-0" />
                    Mi perfil
                </Link>

                {context === 'admin' ? (
                    <Link
                        href="/routes"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-stone-600
                            hover:bg-stone-50 transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4 shrink-0" />
                        Volver al sitio
                    </Link>
                ) : isAdmin && (
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-stone-600
                            hover:bg-stone-50 transition-colors"
                    >
                        <Cog6ToothIcon className="w-4 h-4 shrink-0" />
                        Panel Admin
                    </Link>
                )}

                {!isPremium && (
                    <Link
                        href="/premium"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-stone-600
                            hover:bg-stone-50 transition-colors"
                    >
                        <SparklesIcon className="w-4 h-4 shrink-0" />
                        Pásate a Premium
                    </Link>
                )}

                <div className="border-t border-stone-100">
                    <button
                        type="button"
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500
                            hover:bg-red-50 transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 shrink-0" />
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
