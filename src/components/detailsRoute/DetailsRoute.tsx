'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRoute } from '@/queries/routeQuery';
import FavoriteButton from '@/components/buttons/FavoriteButton/FavoriteButton';
import DetailsRouteImagesPreview from '@/components/detailsRouteImage/DetailsRouteImages';
import DetailsRouteMap from '@/components/detailsRouteMap/DetailsRouteMap';
import CommentsList from '@/components/comments/CommentsList';
import Avatar from '@/components/avatar/Avatar';
import SessionButton from '@/components/detailsRoute/components/SessionButton';
import WellbeingCheckinForm from '@/components/wellbeingCheckin/WellbeingCheckinForm';
import { useAuth } from '@/hooks/useAuth';
import { FormatDate } from '@/shared/utils/formatDate';
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
import { ToSingular } from '@/shared/utils/toSingular';
import { ToHoursAndMinutes } from '@/shared/utils/toHoursAndMinutes';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { ExclamationTriangleIcon, ArrowLongRightIcon, ArrowPathIcon, MapPinIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function DetailsRoute({ slug, initialRoute }: { slug: string, initialRoute: IRoute }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currentUser } = useAuth();
    const [commentsCount, setCommentsCount] = useState<number>(initialRoute.comments?.length || 0);

    // Param ?checkin=<idSession> → mostrar WellbeingCheckinForm tras volver de /tracking
    const checkinParam = searchParams.get('checkin');
    const checkinSessionId = checkinParam !== null && !isNaN(Number(checkinParam))
        ? Number(checkinParam)
        : null;

    // Retraso de 1 s para que la página cargue antes de abrir el modal
    const [showCheckin, setShowCheckin] = useState(false);
    useEffect(() => {
        if (checkinSessionId === null) return;
        const timer = setTimeout(() => setShowCheckin(true), 1000);
        return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkinSessionId]);

    const handleCheckinDone = () => {
        router.replace(`/route/${slug}`);
    };

    const { data: route, isLoading, isError } = useRoute(slug);

    if (isLoading) return (
        <div className="container mx-auto px-4 animate-pulse">
            <div className="w-48 h-6 bg-stone-200 rounded-lg mb-3"></div>
            <div className="w-80 h-7 bg-stone-200 rounded-lg mb-3"></div>
            <div className="w-80 h-6 bg-stone-200 rounded-lg mb-3"></div>

            <div className="flex gap-1 mb-4">
                <div className="grid grid-cols-2 w-full md:w-[54.7%] h-[404px] gap-1">
                    <div className="h-64 col-span-2 bg-stone-200 rounded-tl-2xl"></div>
                    <div className="h-36 bg-stone-200 rounded-bl-2xl"></div>
                    <div className="h-36 bg-stone-200"></div>
                </div>
                <div className="w-full md:w-[44.7%] h-[404px] bg-stone-200 rounded-r-2xl"></div>
            </div>

            <div className="h-52 flex gap-1">
                <div className="w-full md:w-[54.7%] mr-2 bg-stone-200 rounded-xl"></div>
                <div className="w-full md:w-[44.7%] ml-2 bg-stone-200 rounded-xl"></div>
            </div>
        </div>
    );
    if (isError || !route) return (
        <div className="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Hubo un error al cargar la ruta</span>
        </div>
    );

    return (
        <>
        <div className="container mx-auto flex flex-row flex-wrap gap-1">
            <section className="w-full">
                <p className="text-sm font-medium text-gray-600 flex items-center gap-2 px-4">
                    <MapPinIcon className="w-5 h-5" />
                    <Link
                        href={`/routes?category=${route.category}`}
                        className="hover:text-gray-800 hover:underline underline-offset-2 transition duration-300"
                    >
                        {CapitalizeFirstLetter(ToSingular(route!.category))}
                    </Link>
                    <ArrowLongRightIcon className="w-5 h-5" />
                    <Link
                        href={`/routes?location=${route.location}`}
                        className="hover:text-gray-800 hover:underline underline-offset-2 transition duration-300"
                    >
                        {route.location}
                    </Link>
                </p>

                {/* Fila título + botón de sesión */}
                <div className="w-full flex items-end justify-between gap-3 pt-0.5 pb-0.5 md:pb-0.5 px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-teal-700 leading-tight">
                        {CapitalizeFirstLetter(route.title)}
                    </h1>

                    {currentUser.isAuthenticated && (
                        <div className="shrink-0">
                            <SessionButton
                                idRoute={route.idRoute}
                                routeSlug={route.slug}
                            />
                        </div>
                    )}
                </div>

                {/* Fila meta: reseñas/dificultad + favorito al margen derecho */}
                <div className="w-full flex items-center justify-between flex-wrap gap-y-1 text-base font-semibold text-gray-700 pb-3 px-4">
                    <div className="flex flex-wrap items-center gap-x-1">
                        <div className="flex items-center gap-1 shrink-0">
                            <span className="text-sm font-medium text-gray-600">
                                Reseñas:
                            </span>
                            <StarIcon className="w-5 h-5 text-amber-500" /> {route.averageRatings}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        </div>
                        <span className="gap-x-2">
                            <span className="text-sm font-medium text-gray-600">Dificultad:&nbsp;&nbsp;</span>
                            <Link
                                href={`/routes?difficulty=${route.difficulty}`}
                                className="hover:text-gray-700 hover:underline underline-offset-2 transition duration-300"
                            >
                                {CapitalizeFirstLetter(route.difficulty)}
                            </Link>
                            &nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
                        </span>
                        <FavoriteButton
                            initialIsFavorite={route.favorited}
                            initialCount={route.favoritesCount}
                            slug={route.slug}
                            origin="detailsRoute"
                        />
                    </div>
                </div>
            </section>

            <section className="w-full md:w-[54.7%] h-[404px] md:order-1 order-2 md:space-y-6 animate-fade-in">
                {/* Imágenes de la ruta */}
                {route.images && route.images.length > 0 ? (
                    <DetailsRouteImagesPreview
                        images={route.images}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full rounded-b-2xl md:rounded-br-none md:rounded-l-2xl bg-stone-100 text-stone-400 gap-3">
                        <PhotoIcon className="w-16 h-16" />
                        <span className="text-sm font-medium">Sin imágenes disponibles</span>
                    </div>
                )}
            </section>

            <section className="w-full md:w-[44.7%] h-[404px] md:order-2 order-1 md:space-y-6 animate-fade-in">
                {/* Mapa */}
                <DetailsRouteMap route={route} />
            </section>

            <section className="flex flex-wrap md:flex-nowrap order-3 pt-6 pb-7 px-4">
                <div className="
                    w-full md:w-[55%] tracking-wide text-gray-700 font-medium
                    text-justify md:border-r md:border-stone-200 md:pr-9 order-5 md:order-4"
                >
                    {route.description}
                </div>

                <div className="w-full md:w-[45%] grid grid-cols-3 gap-y-2 order-4 md:order-5 pb-6 md:pb-0 md:px-4">
                    <div className="flex flex-col items-center">
                        <span className="text-4xl lg:text-5xl font-black text-teal-700">
                            {route.distance}
                            <span className="text-base">&nbsp;km</span>
                        </span>
                        <span className="text-sm font-medium text-gray-600">Distancia</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-teal-700">
                            {route.typeRoute === 'circular'
                                ? <ArrowPathIcon strokeWidth={3} className="w-12 h-12" />
                                : <ArrowLongRightIcon strokeWidth={3} className="w-10 h-10 lg:w-12 lg:h-12" />
                            }
                        </span>
                        <span className="text-sm font-medium text-gray-600">{CapitalizeFirstLetter(route.typeRoute)}</span>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-4xl lg:text-5xl font-black text-teal-700">
                            {ToHoursAndMinutes(route.duration).hours}
                            <span className="text-base">&nbsp;h&nbsp;&nbsp;</span>
                            {ToHoursAndMinutes(route.duration).minutes}
                            <span className="text-base">&nbsp;min</span>
                        </span>
                        <span className="text-center text-sm font-medium text-gray-600">Tiempo estimado</span>
                    </div>

                    <div className="flex flex-col items-center col-span-3 pt-2 pb-1 md:pb-0">
                        <span className="text-2xl font-black text-teal-700">
                            {FormatDate(route.createdAt)}
                        </span>
                        <span className="text-sm font-medium text-gray-600">Fecha de publicación</span>
                    </div>

                    <div className="flex flex-row items-center justify-center gap-3 col-span-3">
                        {typeof route.user === 'object' && (
                            <>
                            <Link
                                href={currentUser.isAuthenticated ? `/profile/${route.user.username}` : '/login'}
                                className="transition duration-200 hover:brightness-90"
                            >
                                {route.user.imgUser ? (
                                    <Avatar src={route.user.imgUser} name={route.user.name} surname={route.user.surname} />
                                ) : (
                                    <Avatar name={route.user.name} surname={route.user.surname} />
                                )}
                            </Link>

                            <Link
                                href={currentUser.isAuthenticated ? `/profile/${route.user.username}` : '/login'}
                                className="
                                    flex flex-col text-2xl font-black text-teal-700
                                    transition duration-300"
                            >
                                <span className="hover:underline underline-offset-2">
                                    {route.user.name} {route.user.surname}
                                </span>
                                <span className="text-sm font-medium text-gray-600">Autor</span>
                            </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="w-full order-6 border-t border-stone-200 pt-5 px-4">
                <h2 className="text-lg font-bold text-gray-500 px-24 pt-2 pb-3">
                    Comentarios ({commentsCount})
                </h2>
                <CommentsList
                    routeSlug={route.slug}
                    initialComments={{comments: route.comments || [], averageRatings: route.averageRatings}}
                    onCommentsCount={(count) => setCommentsCount(count)}
                />
            </section>
        </div>

        {/* Modal check-in post-ruta — se activa via ?checkin=<idSession> con retardo */}
        {showCheckin && checkinSessionId !== null && (
            <WellbeingCheckinForm
                idSession={checkinSessionId}
                onClose={handleCheckinDone}
                onSuccess={handleCheckinDone}
            />
        )}
        </>
    );
}
