'use client';

import dynamic from 'next/dynamic';
import { IRoute } from '@/shared/interfaces/entities/route.interface';

// Importar Map dinámicamente sin SSR
const LazyMap = dynamic(() => import('./OneRouteMap'), { 
        loading: () => (
            <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-gray-500">
                Cargando mapa...
            </div>
        ),
        ssr: false 
});

export default function DetailsRouteMap({ route }: { route: IRoute }) {
    if (!route) {
        return (
            <div className="w-full h-full flex items-center justify-center text-xl font-semibold text-gray-500">
                No hay ruta para mostrar
            </div>
        );
    }

    return <LazyMap route={route} />;
}