import { Metadata } from "next";
import { cache } from 'react'
import { RouteService } from '@/services/routeService';
import DetailsRoute from "@/components/detailsRoute/DetailsRoute";
import { IRoute } from "@/shared/interfaces/entities/route.interface";


// Función cacheada para obtener rutas
const getOneRoute = cache(async(slug: string) => {
    return RouteService.getBySlug(slug);
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    // Obtiene el slug de los parámetros
    const { slug } = await params;

    const route: IRoute = await getOneRoute(slug);
    const routeKeywords = route.title?.toLowerCase();

    return {
        metadataBase: new URL(`https://vitaltrail.com/routes/${slug}`),
        description: route.title,
        keywords: [
            'rutas', 'senderismo', 'montaña', 'naturaleza', 'aire libre', 'equilibrio', 'vida sana',
            routeKeywords
        ],
        openGraph: {
            description: route.title,
            url: `https://vitaltrail.com/routes/${slug}`,
            images: route.images?.map(image => ({
                url: `/route_images/${image.imgRoute}`,
                alt: route.title
            }))
        }
    };
}

export default async function DetailsRoutePage({ params }: { params: { slug: string } }) {
    // Obtiene el slug de los parámetros
    const { slug } = await params;
    const route: IRoute = await getOneRoute(slug);
    console.log(route);

    return (
        <main className="container mx-auto md:px-8 lg:px-12 flex-grow mt-5">
            <section className="flex min-h-[calc(100vh-64px-64px)] gap-6 mb-8">
                <DetailsRoute
                    slug={slug}
                    initialRoute={route}
                />
            </section>
        </main>
    );
}