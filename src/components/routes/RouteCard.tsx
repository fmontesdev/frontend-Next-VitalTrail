'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RouteImagesCarousel from '../carousels/RouteImagesCarousel/RouteImagesCarousel';
import FavoriteButton from '@/components/buttons/FavoriteButton/FavoriteButton';
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
import { ToSingular } from '@/shared/utils/toSingular';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { ClockIcon, FlagIcon, PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
import { FireIcon, StarIcon } from '@heroicons/react/24/solid';
import { formatDistance } from '@/shared/utils/distance';

export default function RouteCard({ route, section }: { route: IRoute, section: string }) {
    const router = useRouter();

    return (
        <div
            className={`flex w-full min-h-44 ${section === 'routes' ? 'bg-stone-100' : 'bg-white'} border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer relative`}
            onClick={() => router.push(`/route/${route.slug}`)}
        >
            {/* Imagen */}
            <div className="w-1/3 shrink-0">
                <div className="overflow-hidden w-full h-full">
                    {route.images && route.images.length > 0 ? (
                        <RouteImagesCarousel images={route.images} />
                    ) : (
                        <div className="w-full h-full bg-stone-200 flex items-center justify-center">
                            <PhotoIcon className="w-8 h-8 text-stone-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Botón de favorito */}
            <div
                className="absolute top-2 right-3 bg-white/70 rounded-full p-0.5 z-10"
                onClick={e => e.stopPropagation()}
            >
                <FavoriteButton
                    initialIsFavorite={route.favorited}
                    initialCount={route.favoritesCount}
                    slug={route.slug}
                    origin="routesList"
                />
            </div>

            {/* Información de la ruta */}
            <div className="w-2/3 p-4 flex flex-col gap-2">

                {/* Badge de categoría + autor */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-lime-600 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit shadow-sm">
                        <FlagIcon className="w-3.5 h-3.5 shrink-0" />
                        {CapitalizeFirstLetter(ToSingular(route.category))}
                    </div>
                    {route.user && typeof route.user === 'object' && (
                        <Link
                            href={`/profile/${route.user.username}`}
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1 bg-stone-200 text-stone-500 text-xs font-medium px-3 py-1 rounded-full w-fit hover:bg-stone-300 transition-colors"
                        >
                            <UserIcon className="w-3 h-3 shrink-0" />
                            @{route.user.username}
                        </Link>
                    )}
                </div>

                {/* Título */}
                <h2 className="text-base md:text-lg font-bold text-teal-700 line-clamp-1">
                    {CapitalizeFirstLetter(route.title)}
                </h2>

                {/* Stats en píldoras */}
                <div className="flex flex-wrap gap-1.5">
                    <span className="flex items-center gap-1 bg-amber-50 text-amber-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <StarIcon className="w-3 h-3 shrink-0" />
                        {route.averageRatings}
                    </span>
                    <span className="flex items-center gap-1 bg-rose-50 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        <FireIcon className="w-3 h-3 shrink-0" />
                        {CapitalizeFirstLetter(route.difficulty)}
                    </span>
                    <span className="bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {formatDistance(route.distance)}
                    </span>
                    <span className="bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {CapitalizeFirstLetter(route.typeRoute)}
                    </span>
                    <span className="flex items-center gap-1 bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        <ClockIcon className="w-3 h-3 shrink-0" />
                        {route.duration} h
                    </span>
                </div>

                {/* Descripción */}
                <p className="text-sm font-medium text-stone-500 line-clamp-3 md:line-clamp-2 xl:line-clamp-3">
                    {route.description}
                </p>
            </div>
        </div>
    );
}
