'use client';

import { useEffect, useRef, useState } from 'react';
import { useCategoryRoutes } from '@/queries/categoryRouteQuery';
import CustomSelect, { ISelectOption } from '@/components/common/CustomSelect';

interface IAdminRoutesFiltersProps {
    onSearch: (v: string) => void;
    onCategoryChange: (v: string) => void;
    onSortChange: (v: string) => void;
}

const SORT_OPTIONS: ISelectOption[] = [
    { value: 'createdAt', label: 'Más recientes' },
    { value: 'favoritesCount', label: 'Más populares' },
];

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

    const handleCategoryChange = (val: string) => {
        setCategory(val);
        onCategoryChange(val);
    };

    const handleSortChange = (val: string) => {
        setSort(val);
        onSortChange(val);
    };

    const categoryOptions: ISelectOption[] = [
        { value: '', label: 'Todas las categorías' },
        ...(categories?.map(cat => ({
            value: cat.title,
            label: cat.title.charAt(0).toUpperCase() + cat.title.slice(1).toLowerCase(),
        })) ?? []),
    ];

    return (
        <div className="flex gap-3 mb-6 flex-wrap items-center">
            <input
                type="text"
                placeholder="Buscar por título..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="appearance-none px-4 py-2 text-sm bg-white border border-stone-200 rounded-full
                    focus:outline-none focus:border-lime-600
                    hover:bg-stone-50 text-stone-600 transition-colors min-w-64 outline-none"
            />
            <CustomSelect options={categoryOptions} value={category} onChange={handleCategoryChange} />
            <CustomSelect options={SORT_OPTIONS} value={sort} onChange={handleSortChange} />
        </div>
    );
}
