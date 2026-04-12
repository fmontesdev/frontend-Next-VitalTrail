'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useCategoryRoutes } from '@/queries/categoryRouteQuery';

interface IAdminRoutesFiltersProps {
    onSearch: (v: string) => void;
    onCategoryChange: (v: string) => void;
    onSortChange: (v: string) => void;
}

const selectBase = `
    appearance-none px-4 py-2 pr-8 text-sm bg-white border border-stone-200 rounded-full
    cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-lime-600
    hover:bg-stone-50 text-stone-600 transition-colors
`;
const selectActive = '!bg-lime-600/60 !text-white';

export default function AdminRoutesFilters({ onSearch, onCategoryChange, onSortChange }: IAdminRoutesFiltersProps) {
    const [searchInput, setSearchInput] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('createdAt');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onSearchRef = useRef(onSearch);
    const { data: categories } = useCategoryRoutes();

    // Keep ref in sync with latest prop without adding it to debounce deps
    useEffect(() => { onSearchRef.current = onSearch; });

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearchRef.current(searchInput);
        }, 300);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchInput]); // onSearch removed — accessed via ref to avoid page reset on re-render

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCategory(val);
        onCategoryChange(val);
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSort(val);
        onSortChange(val);
    };

    const isCategoryActive = category !== '';
    const isSortActive = sort !== 'createdAt';

    return (
        <div className="flex gap-3 mb-6 flex-wrap items-center">
            <input
                type="text"
                placeholder="Buscar por título..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="appearance-none px-4 py-2 text-sm bg-white border border-stone-200 rounded-full
                    focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-lime-600
                    hover:bg-stone-50 text-stone-600 transition-colors min-w-64 outline-none"
            />

            {/* Categoría */}
            <div className="relative">
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className={`${selectBase} ${isCategoryActive ? selectActive : ''}`}
                >
                    <option value="">Todas las categorías</option>
                    {categories?.map(cat => (
                        <option key={cat.idCategory} value={cat.title}>
                            {cat.title.charAt(0).toUpperCase() + cat.title.slice(1).toLowerCase()}
                        </option>
                    ))}
                </select>
                {isCategoryActive ? (
                    <button
                        type="button"
                        onClick={() => { setCategory(''); onCategoryChange(''); }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                    >
                        &times;
                    </button>
                ) : (
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                )}
            </div>

            {/* Ordenar */}
            <div className="relative">
                <select
                    value={sort}
                    onChange={handleSortChange}
                    className={`${selectBase} ${isSortActive ? selectActive : ''}`}
                >
                    <option value="createdAt">Más recientes</option>
                    <option value="favoritesCount">Más populares</option>
                </select>
                {isSortActive ? (
                    <button
                        type="button"
                        onClick={() => { setSort('createdAt'); onSortChange('createdAt'); }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                    >
                        &times;
                    </button>
                ) : (
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                )}
            </div>
        </div>
    );
}
