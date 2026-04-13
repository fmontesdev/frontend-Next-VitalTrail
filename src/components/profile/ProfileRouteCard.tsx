'use client';

import { useRouter } from 'next/navigation';
import RouteImagesCarousel from '../carousels/RouteImagesCarousel/RouteImagesCarousel';
import FavoriteButton from '@/components/buttons/FavoriteButton/FavoriteButton';
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
import { ToSingular } from '@/shared/utils/toSingular';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { ClockIcon, FlagIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { FireIcon, StarIcon } from '@heroicons/react/24/solid';
import { formatDistance } from '@/shared/utils/distance';

export default function ProfileRouteCard({ route }: { route: IRoute }) {
    const router = useRouter();

    return (
        <div
            className="relative flex flex-col bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow transition-shadow duration-300 cursor-pointer"
            onClick={() => router.push(`/route/${route.slug}`)}
        >
            {/* Imagen con overlay y controles */}
            <div className="relative h-44 w-full shrink-0">
                {route.images && route.images.length > 0 ? (
                    <RouteImagesCarousel images={route.images} />
                ) : (
                    <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                        <PhotoIcon className="w-8 h-8 text-stone-400" />
                    </div>
                )}

                {/* Gradiente inferior */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                {/* Badge de categoría */}
                <div className="absolute bottom-2 left-3 flex items-center gap-1 bg-lime-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow pointer-events-none">
                    <FlagIcon className="w-3.5 h-3.5 shrink-0" />
                    {CapitalizeFirstLetter(ToSingular(route.category))}
                </div>

                {/* FavoriteButton — stopPropagation para no disparar navegación */}
                <div
                    className="absolute top-2 right-2 bg-white/70 rounded-full p-0.5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FavoriteButton
                        initialIsFavorite={route.favorited}
                        initialCount={route.favoritesCount}
                        slug={route.slug}
                        origin="routesList"
                    />
                </div>
            </div>

            {/* Información */}
            <div className="flex flex-col gap-2 p-3">

                {/* Título */}
                <h2 className="text-sm font-bold text-teal-700 line-clamp-1">
                    {CapitalizeFirstLetter(route.title)}
                </h2>

                {/* Stats en píldoras */}
                <div className="flex flex-wrap gap-1.5">
                    {/* Rating */}
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <StarIcon className="w-3 h-3 shrink-0" />
                        {route.averageRatings}
                    </span>

                    {/* Dificultad */}
                    <span className="flex items-center gap-1 bg-rose-50 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        <FireIcon className="w-3 h-3 shrink-0" />
                        {CapitalizeFirstLetter(route.difficulty)}
                    </span>

                    {/* Distancia */}
                    <span className="bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {formatDistance(route.distance)}
                    </span>

                    {/* Tipo */}
                    <span className="bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {CapitalizeFirstLetter(route.typeRoute)}
                    </span>

                    {/* Duración */}
                    <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <ClockIcon className="w-3 h-3 shrink-0" />
                        {route.duration} h
                    </span>
                </div>
            </div>
        </div>
    );
}
