'use client';

import { useFollowerProfiles } from '@/queries/profileQuery';
import ProfileCard from './ProfileCard';
import { ExclamationTriangleIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function FollowersList({ username }: { username: string }) {
    const { data: followers, isLoading, isError } = useFollowerProfiles(username);

    if (isLoading) return (
        <div className="py-2">
            <div className="w-full flex items-center gap-4 p-5 bg-white border border-stone-200 rounded-2xl animate-pulse">
                <div className="w-[64px] h-[64px] rounded-full bg-stone-200 flex-shrink-0" />
                <div className="w-full flex flex-col gap-2">
                    <div className="w-3/4 h-4 bg-stone-200 rounded-lg" />
                    <div className="w-1/2 h-3 bg-stone-200 rounded-lg" />
                </div>
            </div>
        </div>
    );

    if (isError || !followers) return (
        <div className="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Hubo un error al cargar los seguidores</span>
        </div>
    );

    if (followers.profilesCount === 0) return (
        <div className="flex flex-col items-center justify-center py-12 text-stone-400">
            <UsersIcon className="w-12 h-12 mb-3" />
            <span className="text-sm font-medium">Todavía nadie te sigue</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-3 py-2">
            {followers.profiles.map((profile) => (
                <ProfileCard key={profile.username} profile={profile} />
            ))}
        </div>
    );
}
