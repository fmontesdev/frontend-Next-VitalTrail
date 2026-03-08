'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { IParams } from '@/shared/interfaces/params/params.interface';

export function useSyncFilters(initialParams: IParams): [IParams, (newFilters: IParams) => void] {
    const router = useRouter();
    const pathname = usePathname(); // ruta actual sin query
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<IParams>(initialParams);
    const lastQueryRef = React.useRef<string>(''); // memo del último query que se mantiene entre renders, no provoca re-render

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
        // Compara contra filters actuales como cadena
        const currentQS = new URLSearchParams(Object.entries(filters).filter(([,v]) => v)).toString();
        const nextQS    = new URLSearchParams(Object.entries(newFilters).filter(([,v]) => v)).toString();

        if (currentQS !== nextQS) setFilters(newFilters);
    }, [searchParams]); // Solo depende de searchParams, solo cambia cuando la URL cambia

    // Actualiza la URL solo si filters ha cambiado la query real
    useEffect(() => {
        const newSearchParams = new URLSearchParams(
            Object.entries(filters).filter(([,v]) => v)
        ).toString();

        const newQuery = newSearchParams ? `?${newSearchParams}` : '';
        if (typeof window !== 'undefined') {
            // Compara con window.location.search y con el último query guardado
            if (window.location.search !== newQuery && lastQueryRef.current !== newQuery) {
                lastQueryRef.current = newQuery; // actualiza el memo
                router.replace(`${pathname}${newQuery}`); // reemplaza la URL sin añadir al historial
            }
        }
    }, [filters, pathname, router]);

    return [filters, setFilters];
}
