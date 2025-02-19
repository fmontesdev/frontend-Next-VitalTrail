'use client';

import React from 'react';
import { useFilteredRoutes } from '@/queries/routeQuery';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from "@/components/common/LoadingSpinner";
import RouteCard from '../routes/RouteCard';
import Pagination from '../pagination/pagination';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function MyRoutesList({ username }: { username: string }) {
    const limit = 4;
    const searchParams = useSearchParams();
    const page = searchParams.get('page') || '1';
    const params = { page };
    const author = username;
    const { data: routes, isLoading, isError } = useFilteredRoutes(
        { limit, offset: (parseInt(page) - 1) * limit, author }
    );

    if (isLoading) return (
        <div className="flex flex-col w-full space-y-6">
            {[1, 2].map((_, index) => (
                <div key={index} className="relative flex w-full max-h-48 bg-white border border-stone-200 rounded-2xl overflow-hidden animate-pulse">
                    <div className="w-1/3 bg-stone-200"></div>
                    <div className="absolute top-2 right-5 w-8 h-5 mt-2 bg-stone-200 rounded-lg"></div>
                    <div className="w-2/3 p-4 flex flex-col">
                        <div className="w-24 h-5 mb-3 bg-stone-200 rounded-lg"></div>
                        <div className="w-full h-6 mb-3 bg-stone-200 rounded-lg"></div>
                        <div className="w-full h-4 mb-3 bg-stone-200 rounded-lg"></div>
                        <div className="w-full h-16 bg-stone-200 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
    if (isError) return (
        <div className="flex items-center justify-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
            <span className="font-medium">Hubo un error al cargar las rutas</span>
        </div>
    );

    return (
        <div className="w-full space-y-6 py-2 animate-fade-in">
            {routes && routes.routes.map((route: IRoute) => (
                <RouteCard key={route.idRoute} route={route} section="profile" />
            ))}

            <Pagination
                totalRoutes={routes?.routesCount ?? 0}
                limit={limit}
                params={params}
                url={`/profile/${username}`}
            />
        </div>
    );
}
