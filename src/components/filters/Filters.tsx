'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCategoryRoutes } from '@/queries/categoryRouteQuery';
import { useDistanceDelay } from '@/hooks/useDistanceDelay';
import { useAuth } from '@/hooks/useAuth';
import { useIsPremium } from '@/auth/authorizations';
import { AdjustmentsHorizontalIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
import { IFiltersProps } from '@/shared/interfaces/props/props.interface';
import CustomSelect, { ISelectOption } from '@/components/common/CustomSelect';

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
            page: '1',
            category,
            difficulty,
            distance: distance === '0' ? '' : distance,
            typeRoute,
            location
        });
    }, [category, difficulty, distanceDelay, typeRoute, location]);

    const categoryOptions: ISelectOption[] = [
        { value: '', label: 'Intención' },
        ...(categoriesData?.map(cat => ({
            value: cat.title,
            label: CapitalizeFirstLetter(cat.title),
        })) ?? []),
    ];

    const difficultyOptions: ISelectOption[] = [
        { value: '', label: 'Dificultad' },
        { value: 'fácil', label: 'Fácil' },
        { value: 'moderada', label: 'Moderada' },
        { value: 'difícil', label: 'Difícil' },
        { value: 'experto', label: 'Experto' },
    ];

    const typeRouteOptions: ISelectOption[] = [
        { value: '', label: 'Tipo de ruta' },
        { value: 'solo ida', label: 'Solo ida' },
        { value: 'circular', label: 'Circular' },
    ];

    const hasActiveFilters = category !== '' || difficulty !== '' || distance !== '0' || typeRoute !== '';

    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            <AdjustmentsHorizontalIcon strokeWidth={1} className="w-8 h-8" />

            <CustomSelect
                options={categoryOptions}
                value={category}
                onChange={setCategory}
            />

            <CustomSelect
                options={difficultyOptions}
                value={difficulty}
                onChange={setDifficulty}
            />

            {/* Filtro distancia */}
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

            <CustomSelect
                options={typeRouteOptions}
                value={typeRoute}
                onChange={setTypeRoute}
            />

            {/* Borrar todos los filtros */}
            <button
                type="button"
                className={`appearance-none px-4 py-2 text-sm border rounded-full cursor-pointer
                    focus:outline-none transition-colors
                    ${hasActiveFilters
                        ? 'border-red-300 bg-red-300 text-white hover:bg-red-400'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
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
