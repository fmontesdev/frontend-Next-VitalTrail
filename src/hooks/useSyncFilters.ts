'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { IParams } from '@/shared/interfaces/params/params.interface';

export function useSyncFilters(initialParams: IParams): [IParams, (newFilters: IParams) => void] {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<IParams>(initialParams);

    // Actualiza el estado desde la URL
    useEffect(() => {
        const newFilters: IParams = {
            page: searchParams.get("page") || "1",
            category: searchParams.get("category") || "",
            location: searchParams.get("location") || "",
            title: searchParams.get("title") || "",
            distance: searchParams.get("distance") || "",
            difficulty: searchParams.get("difficulty") || "",
            typeRoute: searchParams.get("typeRoute") || "",
            author: searchParams.get("author") || ""
        };
        if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
            setFilters(newFilters);
        }
    }, [searchParams]); // Solo depende de searchParams

    // Actualiza la URL solo si filters ha cambiado la query real
    useEffect(() => {
        const newSearchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) newSearchParams.set(key, value);
        });
        const newQuery = `?${newSearchParams.toString()}`;
        if (typeof window !== 'undefined') {
            // Compara con window.location.search
            if (window.location.search !== newQuery) {
                router.replace(`${pathname}${newQuery}`);
            }
        }
    }, [filters, pathname, router]);

    return [filters, setFilters];
}
