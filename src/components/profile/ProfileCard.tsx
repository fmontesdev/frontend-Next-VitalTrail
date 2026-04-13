'use client';

import Link from 'next/link';
import Image from 'next/image';
import FollowButton from '../buttons/followButton/FollowButton';
import { IProfile } from '@/shared/interfaces/entities/user.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { UserGroupIcon } from '@heroicons/react/24/outline';

export default function ProfileCard({ profile }: { profile: IProfile }) {
    return (
        <div className="
            w-full flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-2xl
            hover:shadow-md hover:shadow-stone-300 transition-shadow cursor-pointer"
        >
            <Link
                href={`/profile/${profile.username}`}
                className="flex items-center gap-4 flex-grow min-w-0"
            >
                {/* Avatar */}
                <div className="w-[64px] h-[64px] rounded-full flex-shrink-0 overflow-hidden">
                    <Image
                        src={getImageUrl('avatar', profile.imgUser)}
                        alt={profile.username}
                        width={64}
                        height={64}
                        sizes="64px"
                        className="object-cover w-full h-full rounded-full"
                    />
                </div>

                {/* Datos */}
                <div className="flex flex-col min-w-0">
                    <span className="text-base text-teal-700 font-bold leading-tight">
                        {profile.name} {profile.surname}
                    </span>
                    <span className="text-sm text-gray-400 font-medium mb-1">
                        @{profile.username}
                    </span>
                    {profile.bio && (
                        <span className="text-sm text-gray-500 line-clamp-1">
                            {profile.bio}
                        </span>
                    )}
                    {/* Contadores sociales */}
                    <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <UserGroupIcon className="w-3.5 h-3.5" />
                            <span><strong className="text-gray-600">{profile.countFollowers}</strong> seguidores</span>
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">
                            <strong className="text-gray-600">{profile.countFollowings}</strong> siguiendo
                        </span>
                    </div>
                </div>
            </Link>

            {/* Botón de seguir — visible en ambas listas */}
            <div className="flex-shrink-0">
                <FollowButton initialFollowing={profile.following} username={profile.username} />
            </div>
        </div>
    );
}
