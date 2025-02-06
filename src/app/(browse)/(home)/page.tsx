import { Metadata } from "next";
import getCategoriesRoutes from '@/actions/getCategoriesRoutes';
import CategoriesCarousel from "@/components/carousel/CategoriesCarousel";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Suspense } from "react";
// import { ErrorBoundary } from 'react-error-boundary';
// import ErrorFallback from "@/components/common/ErrorFallback";

// Compartir la promesa para no duplicar la consulta
const categoriesPromise = getCategoriesRoutes();

export async function generateMetadata(): Promise<Metadata> {
    const categories = await categoriesPromise;
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
    const categories = await categoriesPromise;

    return (
        <main className="container mx-auto md:px-8 lg:px-12 flex-grow">
            <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-500 pt-8 pb-3 md:pb-4">
                No te pierdas nuestras rutas
            </h1>
            <Suspense fallback={<LoadingSpinner />}>
                {/* <ErrorBoundary
                    FallbackComponent={ErrorFallback}
                > */}
                    <CategoriesCarousel categories={categories} />
                {/* </ErrorBoundary> */}
            </Suspense>
        </main>
    );
}