"use client";

import { useState } from "react";
import { useFavorite, useUnfavorite } from "@/mutations/favoriteMutation";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HearIconSolid } from "@heroicons/react/24/solid";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';
import { IFavoriteButtonProps } from "@/shared/interfaces/props/props.interface";

export default function FavoriteButton({ initialIsFavorite, initialCount, slug, origin }: IFavoriteButtonProps) {
    const { currentUser } = useAuth();
    const router = useRouter();

    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [count, setCount] = useState(initialCount);
    const { mutateAsync: favoriteMutation } = useFavorite();
    const { mutateAsync: unfavoriteMutation } = useUnfavorite();

    const handleClick = () => {
        if (!currentUser.isAuthenticated) {
            router.push("/login");
            return;
        }

        const newFavoriteState = !isFavorite;

        if (newFavoriteState) {
            favoriteMutation(slug).then(() => {
                setIsFavorite(true);
                setCount((prev) => prev + 1);
            });
        } else {
            unfavoriteMutation(slug).then(() => {
                setIsFavorite(false);
                setCount((prev) => prev - 1);
            });
        }
    };

    return (
        <button
            onClick={handleClick}
            className="
                flex items-center space-x-1 text-sm text-gray-700 font-medium
                transform transition-transform duration-300 hover:scale-110
        ">
            {isFavorite ? (
                origin === "routesList"
                    ? <HearIconSolid strokeWidth={2} className="w-5 h-5 text-red-500" />
                    : <HearIconSolid strokeWidth={2} className="w-6 h-6 text-red-500" />
            ) : (
                origin === "routesList"
                    ? <HeartIconOutline strokeWidth={2} className="w-5 h-5 text-gray-600" />
                    : <HeartIconOutline strokeWidth={2} className="w-6 h-6 text-gray-600" />
            )}
            <span>{count}</span>
        </button>
    );
}
