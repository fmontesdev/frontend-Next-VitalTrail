'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCategoryRoutes } from '@/queries/categoryRouteQuery';
import { useDistanceDelay } from '@/hooks/useDistanceDelay';
import { useAuth } from '@/hooks/useAuth';
import { useIsPremium } from '@/auth/authorizations';
import { AdjustmentsHorizontalIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
import { IFiltersProps } from '@/shared/interfaces/props/props.interface';

const selectBase = `
    appearance-none px-4 py-2 pr-8 text-sm bg-white border border-stone-200 rounded-full
    cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-lime-600
    hover:bg-stone-50 text-stone-600 transition-colors
`;
const selectActive = '!bg-lime-600/60 !text-white';

export default function Filters({ initialParams, onFilterChange }: IFiltersProps) {
    const [category, setCategory] = useState<string>(initialParams.category || '');
    const [difficulty, setDifficulty] = useState<string>(initialParams.difficulty || '');
    const [distance, setDistance] = useState<string>(initialParams.distance || '0');
    const [typeRoute, setTypeRoute] = useState<string>(initialParams.typeRoute || '');
    const [location, setLocation] = useState<string>(initialParams.location || '');

    const { data: categoriesData } = useCategoryRoutes();
    const { currentUser } = useAuth();
    const isPremium = useIsPremium();

    // Aplicamos delay al valor de "distance"
    const distanceDelay = useDistanceDelay(distance, 300);

    // Sincroniza el estado local cuando los filtros se resetean externamente (ej: desde el buscador)
    useEffect(() => {
        setCategory(initialParams.category || '');
        setDifficulty(initialParams.difficulty || '');
        setDistance(initialParams.distance || '0');
        setTypeRoute(initialParams.typeRoute || '');
        setLocation(initialParams.location || '');
    }, [initialParams]);

    // Cuando cambien los filtros, enviamos la actualización al padre
    useEffect(() => {
        onFilterChange({
            ...initialParams,
            page: "1",
            category,
            difficulty,
            distance: distance === '0' ? '' : distance,
            typeRoute,
            location
        });
    }, [category, difficulty, distanceDelay, typeRoute, location]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            <AdjustmentsHorizontalIcon strokeWidth={1} className="w-8 h-8" />

            {/* Filtro categoría */}
            <div className="relative">
                <label htmlFor="category" className="sr-only">Intención</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`${selectBase} ${category !== '' ? selectActive : ''}`}
                >
                    <option value="">Intención</option>
                    {categoriesData?.map((cat) => (
                        <option key={cat.idCategory} value={cat.title}>
                            {CapitalizeFirstLetter(cat.title)}
                        </option>
                    ))}
                </select>
                {category !== '' ? (
                    <button
                        type="button"
                        onClick={() => setCategory('')}
                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                    >
                        &times;
                    </button>
                ) : (
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                )}
            </div>

            {/* Filtro dificultad */}
            <div className="relative">
                <label htmlFor="difficulty" className="sr-only">Dificultad</label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={`${selectBase} ${difficulty !== '' ? selectActive : ''}`}
                >
                    <option value="">Dificultad</option>
                    <option value="fácil">Fácil</option>
                    <option value="moderada">Moderada</option>
                    <option value="difícil">Difícil</option>
                    <option value="experto">Experto</option>
                </select>
                {difficulty !== '' ? (
                    <button
                        type="button"
                        onClick={() => setDifficulty('')}
                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                    >
                        &times;
                    </button>
                ) : (
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                )}
            </div>

            {/* Filtro distancia */}
            <div className="relative">
                <label htmlFor="distance" className="sr-only">Distancia</label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-stone-500">Distancia</span>
                    <input
                        type="range"
                        id="distance"
                        min="0"
                        max="100"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-28 accent-lime-500 cursor-pointer"
                    />
                    <span className="text-xs text-stone-400">{distance} km</span>
                </div>
            </div>

            {/* Filtro tipo de ruta */}
            <div className="relative">
                <label htmlFor="typeRoute" className="sr-only">Tipo de ruta</label>
                <select
                    id="typeRoute"
                    value={typeRoute}
                    onChange={(e) => setTypeRoute(e.target.value)}
                    className={`${selectBase} ${typeRoute !== '' ? selectActive : ''}`}
                >
                    <option value="">Tipo de ruta</option>
                    <option value="solo ida">Solo ida</option>
                    <option value="circular">Circular</option>
                </select>
                {typeRoute !== '' ? (
                    <button
                        type="button"
                        onClick={() => setTypeRoute('')}
                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                    >
                        &times;
                    </button>
                ) : (
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                )}
            </div>

            {/* Borrar todos los filtros */}
            <button
                type="button"
                className={`
                    appearance-none px-4 py-2 text-sm border rounded-full cursor-pointer
                    focus:outline-none transition-colors
                    ${category !== '' || difficulty !== '' || distance !== '0' || typeRoute !== ''
                        ? 'border-red-300 bg-red-300 text-white hover:bg-red-400'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }
                `}
                onClick={() => {
                    setCategory('');
                    setDifficulty('');
                    setDistance('0');
                    setTypeRoute('');
                }}
            >
                Borrar filtros
            </button>

            {/* Botón crear ruta — parte del bloque centrado, solo para usuarios premium autenticados */}
            {currentUser.isAuthenticated && isPremium && (
                <Link
                    href="/routes/new"
                    className="flex items-center gap-1.5 bg-lime-600 hover:bg-lime-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
                >
                    <PlusIcon className="w-4 h-4" strokeWidth={2.5} />
                    Crear ruta
                </Link>
            )}
        </div>
    );
}
