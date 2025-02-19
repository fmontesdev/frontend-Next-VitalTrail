"use client";

import Link from "next/link";
import RouteImagesCarousel from "../carousels/RouteImagesCarousel/RouteImagesCarousel";
import FavoriteButton from "@/components/buttons/FavoriteButton/FavoriteButton";
import { CapitalizeFirstLetter } from "@/shared/utils/capitalizeFirstLetter";
import { ToSingular } from "@/shared/utils/toSingular";
import { IRoute } from "@/shared/interfaces/entities/route.interface";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export default function RouteCard({ route, section }: { route: IRoute, section: string }) {
    const bgColour = section === 'routes' ? 'stone-100' : 'white';

    return (
        <div className={`
                flex w-full bg-${bgColour} border border-stone-200 rounded-2xl
                overflow-hidden hover:shadow-md transition-shadow cursor-pointer
                relative max-h-48`}
        >
            {/* Carrusel de imágenes */}
            <div className="w-1/3">
                <RouteImagesCarousel images={route.images} />
            </div>
                            
            {/* Botón de favorito */}
            <div className="absolute top-2 right-5 mt-2">
                <FavoriteButton
                    initialIsFavorite={route.favorited}
                    initialCount={route.favoritesCount}
                    slug={route.slug}
                    origin="routesList"
                /> 
            </div>

            {/* Información de la ruta */}
            <Link
                href={`/route/${route.slug}`}
                className="w-2/3 p-4 flex flex-col"
            >
                <p className="text-xs md:text-sm font-medium text-gray-600 flex items-center gap-1 pb-2">
                    <MapPinIcon className="w-5 h-5" />
                    {CapitalizeFirstLetter(ToSingular(route.category))}
                </p>
                <h2 className="text-base md:text-lg font-bold text-teal-700 line-clamp-1 pb-1">{CapitalizeFirstLetter(route.title)}</h2>
                <div className="text-xs lg:text-sm font-bold text-gray-600 flex flex-wrap gap-x-2 line-clamp-2 pt-1 pb-2 md:pb-1 xl:pb-2">
                    <div className="flex items-center gap-1 shrink-0">
                        <StarIcon className="w-4 h-4 text-amber-500" /> {route.averageRatings}&nbsp;&nbsp;•
                    </div>
                    <span>{CapitalizeFirstLetter(route.difficulty)}&nbsp;&nbsp;•</span>
                    <span>{route.distance} km&nbsp;&nbsp;•</span>
                    <span>{CapitalizeFirstLetter(route.typeRoute)}&nbsp;&nbsp;•</span>
                    <span>Est. {route.duration} h</span>
                </div>
                <p className="
                    text-sm xl:text-base font-medium text-gray-600 line-clamp-3 md:line-clamp-2
                    xl:line-clamp-3 min-h-[4.5em] md:min-h-[3.0em] xl:min-h-[4.5em]"
                >
                    {route.description}
                </p>
            </Link>
        </div>
    );
}
