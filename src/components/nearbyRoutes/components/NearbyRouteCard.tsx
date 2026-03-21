'use client'

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, BLUR_DATA_URL } from '@/shared/utils/imageUrl';
import { IRoute } from '@/shared/interfaces/entities/route.interface';

interface INearbyRouteCardProps {
    route: IRoute;
    distanceKm: number;
}

// Formatea la distancia para mostrar al usuario
const formatearDistancia = (km: number): string =>
    km < 1 ? '< 1 km de ti' : `${km} km de ti`;

const NearbyRouteCard: React.FC<INearbyRouteCardProps> = ({ route, distanceKm }) => {
    const imgRoute = route.images?.[0]?.imgRoute;
    const imageUrl = imgRoute ? getImageUrl('route', imgRoute) : null;

    return (
        <Link href={'/route/' + route.slug} className="group block w-full">
            <div className="flex flex-col items-center gap-3">
                {/* Círculo con imagen, gradiente y badges */}
                <div className="relative w-full aspect-square rounded-full overflow-hidden">
                    {/* Imagen de fondo */}
                    {imageUrl ? (
                        <Image
                            fill
                            src={imageUrl}
                            alt={route.title}
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            placeholder="blur"
                            blurDataURL={BLUR_DATA_URL}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-400 to-lime-500" />
                    )}

                    {/* Gradiente oscuro para legibilidad del texto */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/70" />

                    {/* Badge de distancia — parte superior */}
                    <span className="absolute top-[15%] left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-lime-600 text-white text-xs font-semibold rounded-full shadow">
                        {formatearDistancia(distanceKm)}
                    </span>

                    {/* Título, categoría y dificultad — parte inferior */}
                    <div className="absolute bottom-[10%] left-[10%] right-[10%] flex flex-col items-center gap-1">
                        <p className="text-center text-white text-sm font-bold leading-tight line-clamp-2 drop-shadow">
                            {route.title}
                        </p>
                        <span className="px-2 py-0.5 text-xs font-medium bg-teal-600/80 text-white rounded-full">
                            {route.category}
                        </span>
                        <span className="px-2 py-0.5 text-xs font-medium bg-black/40 text-white/90 rounded-full">
                            {route.difficulty}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default NearbyRouteCard;
