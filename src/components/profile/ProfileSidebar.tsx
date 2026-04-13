'use client';

import { useProfile } from '@/queries/profileQuery';
import { useCanFollow, useCanEdit, useIsPremium, useIsAuthor } from '@/auth/authorizations';
import FollowButton from '../buttons/followButton/FollowButton';
import Image from 'next/image';
import Link from 'next/link';
import { MapIcon, BellAlertIcon, CurrencyEuroIcon, PencilSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ProfileSidebarProps } from '@/shared/interfaces/props/props.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';

export default function ProfileSidebar({ username, activeTab, setActiveTab }: ProfileSidebarProps) {
    const { data: profile, isLoading, isError } = useProfile(username);
    const { canFollow } = useCanFollow(username);
    const { canEdit } = useCanEdit(username);
    const isPremium = useIsPremium();
    const isAuthor = useIsAuthor(username);
    // console.log(profile);

    // Funciones para cambiar la pestaña
    const showMyContent = () => setActiveTab('miContenido');
    const showMyNotifications = () => setActiveTab('misNotificaciones');
    const showMySubscription = () => setActiveTab('miSuscripción');
    const showUpdateProfile = () => setActiveTab('editarPerfil');

    if (isLoading)
        return (
            // Esqueleto
            <aside className="
                w-1/4 bg-stone-100 border border-stone-200
                rounded-2xl px-7 py-5 overflow-hidden animate-pulse
            ">
                {/* Avatar */}
                <div className="w-20 h-20 bg-stone-300 rounded-full"></div>

                {/* Datos */}
                <div className="mt-4">
                    <div className="w-full h-7 bg-stone-300 rounded-lg mb-3"></div>
                    <div className="w-full h-5 bg-stone-300 rounded-lg mb-2"></div>
                    <div className="w-full h-5 bg-stone-300 rounded-lg"></div>
                </div>
            </aside>
        );

    if (isError || !profile)
        return (
            <aside className="
                w-1/4 bg-stone-100 border border-stone-200
                rounded-2xl px-7 py-5 overflow-hidden animate-fade-in
            ">
                <div className="text-center text-md text-red-500 font-bold">
                    Error al cargar el perfil
                </div>
            </aside>
        );

    return (
        <aside className="
            w-1/4 bg-stone-100 border border-stone-200
            rounded-2xl px-7 py-5 overflow-hidden animate-fade-in
        ">
            <div className="flex justify-between items-start">
                {/* Avatar */}
                <div className="rounded-full overflow-hidden w-20 h-20 shrink-0">
                    <Image
                        src={getImageUrl('avatar', profile.imgUser)}
                        alt={profile.username}
                        width={80}
                        height={80}
                        sizes="80px"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex items-center gap-2 mt-1">
                    {canFollow && (
                        <div className="w-16 flex justify-center items-center">
                            <FollowButton initialFollowing={profile.following} username={profile.username} />
                        </div>
                    )}
                    {canEdit && isPremium && isAuthor && (
                        <Link
                            href="/routes/new"
                            className="flex items-center gap-1.5 bg-lime-600 hover:bg-lime-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
                            Crear ruta
                        </Link>
                    )}
                </div>
            </div>

            {/* Nombre y datos */}
            <div className="mt-4">
                <h2 className="text-2xl text-teal-700 font-bold pb-2">
                    {profile.name} {profile.surname}
                </h2>
                {/* <p className="text-sm text-gray-400 font-semibold pb-1">
                    Fecha de nacimiento: {profile.birthday}
                </p>
                <p className="text-md text-gray-600 font-semibold">{profile.bio}</p> */}
            </div>

            {/* Contenidos */}
            <div className="mt-1 text-base text-gray-400 font-bold">
                <button
                    onClick={showMyContent}
                    className={`flex items-center gap-2 px-1 pt-1 pb-2 hover:text-gray-500 transition duration-250 ease-in-out
                        ${activeTab === 'miContenido'
                        ? 'text-teal-700 hover:text-teal-700'
                        : ''}
                    `}
                >
                    <MapIcon strokeWidth={2} className="h-5 w-5" />
                    Mi contenido
                </button>

                {canEdit && (
                    <>
                        <button
                            onClick={showMyNotifications}
                            className={`flex items-center gap-2 px-1 pt-1 pb-2 hover:text-gray-500 transition duration-250 ease-in-out
                                ${activeTab === 'misNotificaciones'
                                ? 'text-teal-700 hover:text-teal-700'
                                : ''}
                            `}
                        >
                            <BellAlertIcon strokeWidth={2} className="h-5 w-5" />
                            Mis notificaciones
                        </button>
                        
                        {isPremium && (
                            <button
                                onClick={showMySubscription}
                                className={`flex items-center gap-2 px-1 pt-1 pb-2 hover:text-gray-500 transition duration-250 ease-in-out
                                    ${activeTab === 'miSuscripción'
                                    ? 'text-teal-700 hover:text-teal-700'
                                    : ''}
                                `}
                            >
                                <CurrencyEuroIcon strokeWidth={2} className="h-5 w-5" />
                                Mi suscripción
                            </button>
                        )}

                        <button
                            onClick={showUpdateProfile}
                            className={`flex items-center gap-2 px-1 pt-1 pb-2 hover:text-gray-500 transition duration-250 ease-in-out
                                ${activeTab === 'editarPerfil'
                                ? 'text-teal-700 hover:text-teal-700'
                                : ''}
                            `}
                        >
                            <PencilSquareIcon strokeWidth={2} className="h-5 w-5" />
                            Editar Perfil
                        </button>
                    </>
                )}
            </div>
        </aside>
    );
}
