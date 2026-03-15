import { Metadata } from 'next';
import { cache } from 'react';
import getCategoriesRoutes from '@/actions/getCategoriesRoutes';
import CategoryGrid from '@/components/categoryGrid/CategoryGrid';
import TrendingRoutes from '@/components/trendingRoutes/TrendingRoutes';
import NearbyRoutes from '@/components/nearbyRoutes/NearbyRoutes';
import { ICategoryRoute } from '@/shared/interfaces/entities/categoryRoute.interface';

// Función cacheada para obtener categorías
const getCategories = cache(async () => {
    return getCategoriesRoutes();
});

export async function generateMetadata(): Promise<Metadata> {
    const categories: ICategoryRoute[] = await getCategories();
    const categoryKeywords = categories.map(category => category.title.toLowerCase());

    return {
        keywords: [
            'rutas', 'senderismo', 'montaña', 'naturaleza', 'aire libre', 'equilibrio', 'vida sana',
            ...categoryKeywords
        ],
        openGraph: {
            images: categories.map(category => ({
                url: `/categories_carousel/${category.imgCategory}`,
                alt: category.title
            }))
        }
    };
}

export default async function HomePage() {
    const categories: ICategoryRoute[] = await getCategories();

    return (
        <>
            <main className="container mx-auto md:px-8 lg:px-16 xl:px-32 flex-grow">
                <section className="px-4 pt-8 pb-8">
                    <CategoryGrid categories={categories} />
                </section>
                <section className="px-4 pb-8">
                    <TrendingRoutes />
                </section>
                <section className="px-4 pb-12">
                    <NearbyRoutes />
                </section>
            </main>
        </>
    );
}
