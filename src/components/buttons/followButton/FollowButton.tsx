'use client';

import { useState } from "react";
import { useFollow, useUnfollow } from "@/mutations/profileMutation";
// import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";

export default function FollowButton({ initialFollowing, username }: { initialFollowing: boolean, username: string }) {
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const { mutateAsync: unfollowMutation } = useUnfollow(username);
    const { mutateAsync: followMutation } = useFollow(username);

    const toggleFollow = () => {
        const newFollowState = !isFollowing;

        if (newFollowState) {
            followMutation().then(() => setIsFollowing(true));
        } else {
            unfollowMutation().then(() => setIsFollowing(false));
        }
    };

    return (
        <button
            onClick={toggleFollow}
            className={`
                flex flex-col items-center space-y-1 transform transition-transform duration-300 hover:scale-110
                ${isFollowing ? 'text-red-500' : 'text-blue-600'}
            `}
        >
            {isFollowing
                ? <UserMinusIcon strokeWidth={2} className="w-7 h-7" />
                : <UserPlusIcon strokeWidth={2} className="w-7 h-7" />
            }
            <span className="text-xs font-medium text-gray-600 leading-none bg-stone-100 rounded-xl px-2 py-1">
                {isFollowing ? 'No seguir' : 'Seguir'}
            </span>
        </button>
    );
}
