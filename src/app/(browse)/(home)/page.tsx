import { Metadata } from "next";
import { cache } from 'react'
import getCategoriesRoutes from '@/actions/getCategoriesRoutes';
import CategoriesCarousel from "@/components/carousels/CategoriesCarousel/CategoriesCarousel";
import { Suspense } from "react";
import { SunIcon, MapIcon, MapPinIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ICategoryRoute } from "@/shared/interfaces/entities/categoryRoute.interface";

// Función cacheada para obtener categorías
const getCategories = cache(async() => {
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
    console.log(categories);

    return (
        <main className="container mx-auto md:px-8 lg:px-16 xl:px-32 flex-grow">
            <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-semibold text-lime-600 pl-4 pt-6 pb-2 md:pb-3">
                <MapPinIcon strokeWidth={2} className="w-8 h-8" />
                Encuentra tu camino
            </h1>
            <Suspense fallback={<LoadingSpinner />}>
                    <CategoriesCarousel categories={categories} />
            </Suspense>
        </main>
    );
}