'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSearchRoutes } from '@/queries/routeQuery';
import { MagnifyingGlassIcon, XMarkIcon, MapIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Unión discriminada para resultados del buscador
type TSearchResult =
    | { kind: 'route'; id: number; title: string; slug: string }
    | { kind: 'location'; location: string };

export default function Search() {
    // Estado para el texto de búsqueda — inicializado vacío para que SSR y cliente coincidan
    const [query, setQuery] = useState<string>('');
    // Para mostrar/ocultar el dropdown
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    // Referencia para detectar clics fuera
    const containerRef = useRef<HTMLDivElement>(null);
    // Hook para redireccionar
    const routerApp = useRouter();
    const pathname = usePathname();

    // Recuperar búsqueda guardada de localStorage tras el montaje — evita hydration mismatch
    // (localStorage no está disponible en SSR; el useEffect solo se ejecuta en el cliente)
    useEffect(() => {
        const saved = localStorage.getItem('searchQuery');
        if (saved) setQuery(saved);
    }, []);

    // Una sola búsqueda por título — las localizaciones se extraen de sus resultados
    const { data: routeData, isLoading, isError } = useSearchRoutes(query);

    // Máximo 5 resultados de rutas por título
    const routeItems: TSearchResult[] = (routeData?.routes ?? [])
        .slice(0, 5)
        .map(r => ({ kind: 'route' as const, id: r.idRoute, title: r.title, slug: r.slug }));

    // Mostrar localización solo si más de una ruta comparte la misma localización
    const locationCounts = (routeData?.routes ?? []).reduce<Record<string, number>>((acc, r) => {
        acc[r.location] = (acc[r.location] ?? 0) + 1;
        return acc;
    }, {});

    const locationItems: TSearchResult[] = Object.entries(locationCounts)
        .filter(([, count]) => count > 1)
        .map(([location]) => ({ kind: 'location' as const, location }));

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        setShowDropdown(value.length > 0);
    };

    // Mostrar dropdown si el input gana foco y hay texto
    const handleFocus = () => {
        if (query.length > 0) {
            setShowDropdown(true);
        }
    };

    // Detectar clic fuera para cerrar dropdown
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Función para capitalizar la primera letra de un texto
    const capitalizeFirstLetter = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    // Maneja la selección de un resultado — guarda en localStorage y navega
    function handleResultClick(result: TSearchResult) {
        setShowDropdown(false);
        if (result.kind === 'route') {
            const text = capitalizeFirstLetter(result.title);
            setQuery(text);
            localStorage.setItem('searchQuery', text);
            routerApp.push(`/route/${result.slug}`);
        } else {
            setQuery(result.location);
            localStorage.setItem('searchQuery', result.location);
            routerApp.push(`/routes?location=${encodeURIComponent(result.location)}`);
        }
    }

    return (
        <div className="relative" ref={containerRef}>
            {/* Icono de lupa */}
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
                type="text"
                name="search"
                value={query}
                onChange={handleInputChange}
                onFocus={handleFocus}
                placeholder="Busca por ciudad o nombre de la ruta…"
                className="
                    border rounded-full pl-10 pr-4 py-1.5 w-full text-teal-700 font-semibold text-base md:text-lg
                    focus:outline-none focus:ring-1 focus:ring-teal-600
            "/>

            {/* Icono de "X" para borrar el input */}
            {query && (
                <button
                    type="button"
                    onClick={() => {
                        setQuery('');
                        setShowDropdown(false);
                        localStorage.removeItem('searchQuery');
                        // En el list, eliminar todos los filtros
                        if (pathname === '/routes') {
                            routerApp.push('/routes');
                        }
                    }}
                    className="
                        absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full
                        p-1 text-gray-500 bg-gray-100 hover:text-white hover:bg-red-300"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            )}

            {/* Dropdown */}
            {showDropdown && (
                <div className="
                    absolute left-0 right-0 mt-1 max-h-64 overflow-hidden z-50
                    bg-white border border-gray-200 rounded-2xl text-left
                ">
                    <div className="overflow-y-auto max-h-64">
                        {isLoading && <div className="p-2 text-gray-500">Cargando...</div>}
                        {isError && <div className="p-2 text-red-500">Error al cargar</div>}

                        {/* Sin resultados en ninguna categoría */}
                        {!isLoading && !isError && routeItems.length === 0 && locationItems.length === 0 && (
                            <div className="p-2 text-gray-500">No hay resultados</div>
                        )}

                        {/* Sección de localización */}
                        {locationItems.length > 0 && (
                            <ul>
                                <li className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Localización
                                </li>
                                {locationItems.map(item => (
                                    item.kind === 'location' && (
                                        <li
                                            key={item.location}
                                            className="flex items-center gap-2 py-2 px-4 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleResultClick(item)}
                                        >
                                            <MapPinIcon className="h-5 w-5 shrink-0" />
                                            {item.location}
                                        </li>
                                    )
                                ))}
                            </ul>
                        )}

                        {/* Sección de rutas */}
                        {routeItems.length > 0 && (
                            <ul>
                                <li className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                    Rutas
                                </li>
                                {routeItems.map(item => (
                                    item.kind === 'route' && (
                                        <li
                                            key={item.id}
                                            className="flex items-center gap-2 py-2 px-4 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => handleResultClick(item)}
                                        >
                                            <MapIcon className="h-5 w-5 shrink-0" />
                                            {capitalizeFirstLetter(item.title)}
                                        </li>
                                    )
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
