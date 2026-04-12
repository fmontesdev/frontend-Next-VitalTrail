'use client';

import { useEffect, useRef, useState } from 'react';
import { useCategoryRoutes } from '@/queries/categoryRouteQuery';

interface IAdminRoutesFiltersProps {
    onSearch: (v: string) => void;
    onCategoryChange: (v: string) => void;
    onSortChange: (v: string) => void;
}

const selectBase = 'border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none shadow cursor-pointer transition-colors';
const selectInactive = 'bg-white text-gray-600 hover:bg-stone-100';
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

    return (
        <div className="flex gap-3 mb-6 flex-wrap">
            <input
                type="text"
                placeholder="Buscar por título..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none min-w-64 shadow hover:bg-stone-100"
            />
            <select
                value={category}
                onChange={handleCategoryChange}
                className={`${selectBase} ${category !== '' ? selectActive : selectInactive}`}
            >
                <option value="">Todas las categorías</option>
                {categories?.map(cat => (
                    <option key={cat.idCategory} value={cat.title}>
                        {cat.title.charAt(0).toUpperCase() + cat.title.slice(1).toLowerCase()}
                    </option>
                ))}
            </select>
            <select
                value={sort}
                onChange={handleSortChange}
                className={`${selectBase} ${sort !== 'createdAt' ? selectActive : selectInactive}`}
            >
                <option value="createdAt">Más recientes</option>
                <option value="favoritesCount">Más populares</option>
            </select>
        </div>
    );
}
