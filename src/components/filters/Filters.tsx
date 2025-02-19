'use client';

import { useEffect, useState } from 'react';
import { useCategoryRoutes } from '@/queries/categoryRouteQuery';
import { useDistanceDelay } from '@/hooks/useDistanceDelay';
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { CapitalizeFirstLetter } from '@/shared/utils/capitalizeFirstLetter';
import { IFiltersProps } from '@/shared/interfaces/props/props.interface';

export default function Filters({ initialParams, onFilterChange }: IFiltersProps) {
    const [category, setCategory] = useState<string>(initialParams.category || '');
    const [difficulty, setDifficulty] = useState<string>(initialParams.difficulty || '');
    const [distance, setDistance] = useState<string>(initialParams.distance || '');
    const [typeRoute, setTypeRoute] = useState<string>(initialParams.typeRoute || '');
    const [location, setLocation] = useState<string>(initialParams.location || '');

    const { data: categoriesData, isLoading, isError } = useCategoryRoutes();

    // Aplicamos delay al valor de "distance"
    const distanceDelay = useDistanceDelay(distance, 300);

    // Cuando cambien los filtros, enviamos la actualización al padre
    useEffect(() => {
        onFilterChange({
            ...initialParams,
            page: "1",
            category,
            difficulty,
            distance: distanceDelay.toString(),
            typeRoute,
            location
        });
    }, [category, difficulty, distanceDelay, typeRoute, location]);

    return (
        <div className="flex flex-wrap items-center justify-center gap-4">
            <AdjustmentsHorizontalIcon strokeWidth={1} className="w-8 h-8" />
            {/* Filtro categoría */}
            <div className="relative">
                <label htmlFor="category" className="sr-only">
                    Actividad
                </label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`
                        px-4 py-2 text-sm text-gray-600 bg-white border border-stone-300 rounded-xl cursor-pointer focus:outline-none
                        focus:ring-lime-600/80 focus:border-lime-600/80 hover:bg-stone-100 hover:text-gray-600 shadow
                        ${category !== "" ? "!bg-lime-600/60 text-white " : ""}
                    `}
                >
                    <option value="">Actividad</option>
                    {categoriesData?.map((cat) => (
                        <option key={cat.idCategory} value={cat.title}>
                            {CapitalizeFirstLetter(cat.title)}
                        </option>
                    ))}
                </select>

                {/* Botón para borrar filtro sólo si hay valor */}
                {category !== "" && (
                    <button
                        type="button"
                        onClick={() => setCategory('')}
                        className="
                            absolute top-1/2 right-1 -translate-y-1/2 w-6 h-6 bg-stone-100 rounded-full text-gray-600
                            text-2xl font-medium flex items-center justify-center hover:bg-red-300 hover:text-white"
                    >
                        &times;
                    </button>
                )}
            </div>

            {/* Filtro dificultad */}
            <div className="relative">
                <label htmlFor="difficulty" className="sr-only">
                    Dificultad
                </label>
                <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className={`
                        px-4 py-2 text-sm text-gray-600 bg-white border border-stone-300 rounded-xl cursor-pointer focus:outline-none
                        focus:ring-lime-600/80 focus:border-lime-600/80 hover:bg-stone-100 hover:text-gray-600 shadow
                        ${difficulty !== "" ? "!bg-lime-600/60 text-white " : ""}
                    `}
                >
                    <option value="">Dificultad</option>
                    <option value="fácil">Fácil</option>
                    <option value="moderada">Moderada</option>
                    <option value="difícil">Difícil</option>
                    <option value="experto">Experto</option>
                </select>

                {/* Botón para borrar filtro sólo si hay valor */}
                {difficulty !== "" && (
                    <button
                        type="button"
                        onClick={() => setDifficulty('')}
                        className="
                            absolute top-1/2 right-1 -translate-y-1/2 w-6 h-6 bg-stone-100 rounded-full text-gray-600
                            text-2xl font-medium flex items-center justify-center hover:bg-red-300 hover:text-white"
                    >
                        &times;
                    </button>
                )}
            </div>

            {/* Filtro distancia */}
            <div className="relative">
                <label htmlFor="distance" className="sr-only">
                    Distancia
                </label>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Distancia</span>
                    <input
                        type="range"
                        id="distance"
                        min="0"
                        max="100"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        className="w-28 accent-lime-500 cursor-pointer"
                    />
                    <span className="text-xs text-gray-500">{distance} km</span>
                </div>
            </div>

            {/* Filtro tipo de ruta */}
            <div className="relative">
                <label htmlFor="typeRoute" className="sr-only">
                    Tipo de ruta
                </label>
                <select
                    id="typeRoute"
                    value={typeRoute}
                    onChange={(e) => setTypeRoute(e.target.value)}
                    className={`
                        px-4 py-2 text-sm text-gray-600 bg-white border border-stone-300 rounded-xl cursor-pointer focus:outline-none
                        focus:ring-lime-600/80 focus:border-lime-600/80 hover:bg-stone-100 hover:text-gray-600 shadow
                        ${typeRoute !== "" ? "!bg-lime-600/60 text-white " : ""}
                    `}
                >
                    <option value="">Tipo de ruta</option>
                    <option value="solo ida">Solo ida</option>
                    <option value="circular">Circular</option>
                </select>

                {/* Botón para borrar filtro sólo si hay valor */}
                {typeRoute !== "" && (
                    <button
                        type="button"
                        onClick={() => setTypeRoute('')}
                        className="
                            absolute top-1/2 right-1 -translate-y-1/2 w-6 h-6 bg-stone-100 rounded-full text-gray-600
                            text-2xl font-medium flex items-center justify-center hover:bg-red-300 hover:text-white"
                    >
                        &times;
                    </button>
                )}
            </div>

            {/* Borrar todos los filtros */}
            <button
                type="button"
                className={`
                    px-4 py-2 text-sm text-gray-600 bg-white border border-stone-300 rounded-xl cursor-pointer
                    focus:outline-none focus:ring-lime-600/80 focus:border-lime-600/80 hover:bg-stone-100 shadow
                    ${category !== "" || difficulty !== "" || distance !== "" || typeRoute !== "" || location !== ""
                        ? "!border !border-red-300 !bg-red-300 !text-white hover:!bg-red-400"
                        : ""}
                `}
                onClick={() => {
                    setCategory('');
                    setDifficulty('');
                    setDistance('');
                    setTypeRoute('');
                    setLocation('');
                }}
            >
                Borrar filtros
            </button>
        </div>
    );
}
