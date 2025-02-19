'use client';

import React from 'react';
import { useFilteredRoutes } from '@/queries/routeQuery';
import RouteCard from './RouteCard';
import Pagination from '../pagination/pagination';
import { IRoutesListProps } from '@/shared/interfaces/props/props.interface';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function RoutesList({ totalRoutes, limit, params }: IRoutesListProps) {
    const offset = (parseInt(params.page || '1') - 1) * limit;
    const { data: routes, isLoading, isError } = useFilteredRoutes({ ...params, limit, offset });

    if (isLoading) return (
        <div className="flex flex-col w-full md:w-[55%] space-y-6">
            {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="relative flex w-full max-h-48 bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden animate-pulse">
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
        <div className="w-full md:w-[55%] space-y-6 animate-fade-in">
            {routes && routes.routes.length > 0 ? (
                routes.routes.map((route: IRoute) => (
                <RouteCard key={route.idRoute} route={route} section="routes" />
                ))
            ) : (
                <div className="relative flex w-full max-h-48 bg-stone-100 border border-stone-200 rounded-2xl overflow-hidden animate-pulse">
                    <div className="w-1/3 bg-stone-200"></div>
                    <div className="absolute top-2 right-5 w-8 h-5 mt-2 bg-stone-200 rounded-lg"></div>
                    <div className="w-2/3 p-4 flex flex-col">
                        <div className="w-24 h-5 mb-3 bg-stone-200 rounded-lg"></div>
                        <div className="w-full h-6 mb-3 bg-stone-200 rounded-lg"></div>
                        <div className="w-full h-4 mb-3 bg-stone-200 rounded-lg"></div>
                        <div className="absolute top-1/3 left-1/4 text-4xl font-bold text-teal-700">No hay resultados</div>
                        <div className="w-full h-16 bg-stone-200 rounded-lg"></div>
                    </div>
                </div>
            )}

            <Pagination
                totalRoutes={totalRoutes}
                limit={limit}
                params={params}
                url={`/routes`}
            />
        </div>
    );
}
