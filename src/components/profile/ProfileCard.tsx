'use client';

import Link from 'next/link';
import Image from 'next/image';
import FollowButton from '../buttons/followButton/FollowButton';
import { IProfile } from '@/shared/interfaces/entities/user.interface';

export default function ProfileCard({ list, profile }: { list: string, profile: IProfile }) {
    return (
        <div className="
            w-full flex items-center gap-4 p-5 bg-white border border-stone-20 rounded-2xl
            hover:shadow-md hover:shadow-stone-300 transition-shado cursor-pointer"
        >
            <Link
                href={`/profile/${profile.username}`}
                className="flex items-center gap-4 flex-grow"
                >
                {/* Avatar */}
                <div className="w-[72px] h-[72px] rounded-full flex-shrink-0">
                    <Image
                        src={`/avatar/${profile.imgUser}`}
                        alt={profile.username}
                        width={72}
                        height={72}
                    />
                </div>

                {/* Datos */}
                <div className="w-full flex flex-col">
                    <span className="text-lg text-teal-600 font-bold">
                        {profile.name} {profile.surname}
                    </span>
                    <span className="text-sm text-gray-500 font-semibold line-clamp-2">
                        {profile.bio}
                    </span>
                </div>
            </Link>

            {/* Botón de seguir */}
            {list === 'following' && (
                <div className="w-40 flex justify-center">
                    <FollowButton initialFollowing={true} username={profile.username} />
                </div>
            )}
        </div>
    );
}
