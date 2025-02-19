'use client';

import { useSyncFilters } from '@/hooks/useSyncFilters';
import Filters from "@/components/filters/Filters";
import RoutesList from "@/components/routes/RouteList";
import RouteListMap from "@/components/routeListMap/RouteListMap";
import { IRoutesPageClientProps } from '@/shared/interfaces/props/props.interface';

export default function RoutesPageClient({ initialRoutes, initialParams, limit }: IRoutesPageClientProps) {
    const [filters, setFilters] = useSyncFilters(initialParams);

    return (
        <main className="container mx-auto md:px-8 lg:px-12 flex-grow">
            <div className="text-center font-black text-gray-600 pt-4 pb-4">
                <Filters initialParams={filters} onFilterChange={setFilters} />
            </div>

            <section className="flex min-h-[calc(100vh-150px)] gap-6 mb-6">
                <RoutesList totalRoutes={initialRoutes.routesCount} limit={limit} params={filters} />
                <div className="
                    hidden md:block sticky top-0 w-[44%] h-[calc(100vh-92px)]
                    bg-stone-100 border border-stone-200 rounded-2xl"
                >
                    <RouteListMap routes={initialRoutes} />
                </div>
            </section>
        </main>
    );
}
