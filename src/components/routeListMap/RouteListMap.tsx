'use client';

import dynamic from 'next/dynamic';
import { IRoutes } from '@/shared/interfaces/entities/route.interface';

// Importar Map dinámicamente sin SSR
const LazyMap = dynamic(() => import('./RouteMap'), { 
        loading: () => (
            <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-gray-500">
                Cargando mapa...
            </div>
        ),
        ssr: false 
});

export default function RouteListMap({ routes }: { routes: IRoutes }) {
    if (!routes.routes || routes.routesCount === 0) {
        const mapRoutes: IRoutes | [] = [];
        return <LazyMap routes={mapRoutes} />;
    }

    return <LazyMap routes={routes} />;
}