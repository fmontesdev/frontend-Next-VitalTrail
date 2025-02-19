'use client';

import { useProfile } from '@/queries/profileQuery';
import { useCanFollow } from '@/auth/authorizations';
import FollowButton from '../buttons/followButton/FollowButton';
import Image from 'next/image';

export default function ProfileSidebar({ username }: { username: string }) {
    const { data: profile, isLoading, isError } = useProfile(username);
    const { canFollow } = useCanFollow(username);
    // console.log(profile);

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
            <div className="flex justify-between">
                {/* Avatar */}
                <div className="rounded-full">
                    <Image
                        src={`/avatar/${profile.imgUser}`}
                        alt={profile.username}
                        width={80}
                        height={80}
                    />
                </div>

                {canFollow && (
                    <div className="w-16 flex justify-center mt-1">
                        <FollowButton initialFollowing={profile.following} username={profile.username} />
                    </div>
                )}
            </div>

            {/* Nombre y datos */}
            <div className="mt-4">
                <h2 className="text-2xl text-teal-700 font-bold pb-2">
                    {profile.name} {profile.surname}
                </h2>
                <p className="text-sm text-gray-400 font-semibold pb-1">
                    Fecha de nacimiento: {profile.birthday}
                </p>
                <p className="text-md text-gray-600 font-semibold">{profile.bio}</p>
            </div>
        </aside>
    );
}
