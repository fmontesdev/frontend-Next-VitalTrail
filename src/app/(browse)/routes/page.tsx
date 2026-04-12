import { Metadata } from "next";
import { cache } from 'react'
import { RouteService } from '@/services/routeService';
import { IRoutes } from "@/shared/interfaces/entities/route.interface";
import { IParams } from '@/shared/interfaces/params/params.interface';
import RoutesPageClient from '@/components/routes/RoutesPageClient';
import { getServerImageUrl } from '@/shared/utils/imageUrl';

// Para paginación
const limit = 10;

// Función cacheada para obtener rutas
const getRoutes = cache(async(searchParams: Promise<IParams>): Promise<IRoutes> => {
    // Capturar parámetros de búsqueda desde la URL
    const {
        page='1',
        category='',
        location='',
        title='',
        distance='',
        difficulty='',
        typeRoute='',
        author=''
    } = await searchParams;
    const offset = (parseInt(page) - 1) * limit;

    return RouteService.getFiltered({
        limit,
        offset,
        category,
        location,
        title,
        distance,
        difficulty,
        typeRoute,
        author
    });
});

export async function generateMetadata({ searchParams }: { searchParams: Promise<IParams> }): Promise<Metadata> {
    const routes: IRoutes = await getRoutes(searchParams);
    const routeKeywords = routes.routes.map(route => route.title.toLowerCase());

    return {
        metadataBase: new URL('https://vitaltrail.com/routes'),
        description: "Explora rutas de senderismo únicas y conéctate con la naturaleza",
        keywords: [
            'rutas', 'senderismo', 'montaña', 'naturaleza', 'aire libre', 'equilibrio', 'vida sana',
            ...routeKeywords
        ],
        openGraph: {
            description: 'Explora rutas de senderismo únicas y conéctate con la naturaleza',
            url: 'https://vitaltrail.com/routes',
            images: routes.routes
                .filter(route => route.images && route.images.length > 0)
                .map(route => ({
                    url: getServerImageUrl('route', route.images![0].imgRoute),
                    alt: route.title
                }))
        }
    };
}

export default async function AllRoutesPage({ searchParams }: { searchParams: Promise<IParams> }) {
    const routes: IRoutes = await getRoutes(searchParams);
    const params = await searchParams;

    return <RoutesPageClient initialRoutes={routes} initialParams={params} limit={limit} />;
}
