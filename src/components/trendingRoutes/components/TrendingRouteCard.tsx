'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, BLUR_DATA_URL } from '@/shared/utils/imageUrl';
import { IRoute } from '@/shared/interfaces/entities/route.interface';

interface ITrendingRouteCardProps {
    route: IRoute;
}

const TrendingRouteCard: React.FC<ITrendingRouteCardProps> = ({ route }) => {
    const imgRoute = route.images?.[0]?.imgRoute;
    const imageUrl = imgRoute ? getImageUrl('route', imgRoute) : null;

    return (
        // group en el Link: el CSS group-hover:scale-110 en la imagen se activa sin Framer Motion
        <Link href={'/route/' + route.slug} className="group block w-full">
            <div className="relative h-[300px] rounded-3xl overflow-hidden bg-zinc-900 cursor-pointer">
                {imageUrl ? (
                    // Zoom solo en la imagen — overflow-hidden de la card lo recorta
                    <Image
                        src={imageUrl}
                        alt={route.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
                )}

                {/* Gradiente sobre la imagen para legibilidad del texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    {/* Favoritos — prominentes encima del título */}
                    <p className="text-md font-bold text-lime-400 mb-1">
                        ♥ {route.favoritesCount}
                    </p>

                    {/* Título */}
                    <p className="text-sm font-semibold line-clamp-2 mb-2">{route.title}</p>

                    {/* Chips: categoría + dificultad */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium bg-teal-600/80 text-white px-2 py-0.5 rounded-full capitalize">
                            {route.category}
                        </span>
                        <span className="text-xs font-medium bg-white/20 text-white px-2 py-0.5 rounded-full capitalize">
                            {route.difficulty}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TrendingRouteCard;
