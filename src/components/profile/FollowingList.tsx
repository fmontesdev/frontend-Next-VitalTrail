'use client';

import { useFollowingProfiles } from '@/queries/profileQuery';
import ProfileCard from './ProfileCard';
import { UsersIcon } from '@heroicons/react/24/outline';

export default function FollowingList({ username }: { username: string }) {
const { data: following, isLoading, isError } = useFollowingProfiles(username);
// console.log(following);

    if (isLoading)
        return (
            // Esqueleto
            <div className="p-2">
                <div className="
                    w-full flex items-center gap-4 p-5 bg-white border
                    border-stone-200 rounded-2xl animate-pulse
                ">
                    {/* Avatar */}
                    <div className="w-[72px] h-[72px] rounded-full bg-stone-200 flex-shrink-0"></div>

                    {/* Datos */}
                    <div className="w-full flex flex-col">
                        <div className="w-full h-7 bg-stone-200 rounded-lg mb-2"></div>
                        <div className="w-full h-4 bg-stone-200 rounded-lg mb-1"></div>
                        <div className="w-full h-4 bg-stone-200 rounded-lg"></div>
                    </div>

                    <div className="w-28 h-14 bg-stone-200 rounded-xl"></div>
                </div>
            </div>
        );

    if (isError || !following)
        return (
            <div className="w-full p-5 animate-fade-in">
                <div className="text-md text-red-500 font-bold">
                    Error al cargar los perfiles
                </div>
            </div>
        );

    return (
        <div className="flex flex-wrap gap-4 p-2">
            {following?.profilesCount === 0 ? (
                <div className="flex items-center gap-4 text-lg text-gray-400 font-bold">
                    <UsersIcon className="h-10 w-10" />
                    No sigues a nadie todavía
                </div>
            ) : (
                following?.profiles.map((profile) => (
                    <ProfileCard key={profile.username} list="following" profile={profile} />
                ))
            )}
        </div>
    );
}
