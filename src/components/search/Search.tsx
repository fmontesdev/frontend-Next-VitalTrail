'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchRoutes } from '@/queries/routeQuery';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function Search() {
    // Estado para el texto de búsqueda
    const [query, setQuery] = useState<string>('');
    // Para mostrar/ocultar el dropdown
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    // Referencia para detectar clics fuera
    const containerRef = useRef<HTMLDivElement>(null);
    // Hook para redireccionar
    const routerApp = useRouter();

    // React Query para fetch de rutas en la API
    const { data, isLoading, isError } = useSearchRoutes(query);

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
                placeholder="Busca tus rutas"
                className="
                    border rounded-full pl-10 pr-4 py-2 w-full text-teal-700 font-semibold text-base md:text-lg
                    focus:outline-none focus:ring-1 focus:ring-teal-600
            "/>

            {/* Icono de "X" para borrar el input */}
            {query && (
                <button
                    type="button"
                    onClick={() => {
                        // Borra el texto y redirecciona
                        setQuery("");
                        routerApp.push(`/routes`);
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
                    absolute left-0 right-0 mt-1 max-h-64 overflow-hidden
                    bg-white border border-gray-200 rounded-2xl text-left
                ">
                    <div className="overflow-y-auto max-h-64">
                        {isLoading && <div className="p-2 text-gray-500">Cargando...</div>}
                        {isError && <div className="p-2 text-red-500">Error al cargar</div>}
                        
                        {/* Si no hay datos y no está cargando ni en error */}
                        {!isLoading && !isError && data && data.routes.length === 0 && (
                            <div className="p-2 text-gray-500">No hay resultados</div>
                        )}
                        {/* Si hay datos y no está cargando ni en error */}
                        {!isLoading && !isError && data && data.routes.map((route: IRoute) => (
                            <div
                                key={route.idRoute}
                                className="py-2 px-4 text-gray-500 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    // Fijamos valor en el input, cerramos dropdown y redireccionamos
                                    setQuery(capitalizeFirstLetter(route.title));
                                    setShowDropdown(false);
                                    routerApp.push(`/routes?title=${route.title}`);
                                }}
                            >
                                {capitalizeFirstLetter(route.title)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
