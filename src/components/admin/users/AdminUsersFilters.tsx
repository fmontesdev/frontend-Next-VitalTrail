'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface IAdminUsersFiltersProps {
    onSearch: (v: string) => void;
    onRoleChange: (v: string) => void;
    onPremiumChange: (v: boolean | undefined) => void;
    onActiveChange: (v: boolean | undefined) => void;
}

const selectBase = `
    appearance-none px-4 py-2 pr-8 text-sm bg-white border border-stone-200 rounded-full
    cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-lime-600
    hover:bg-stone-50 text-stone-600 transition-colors
`;
const selectActive = '!bg-lime-600/60 !text-white';

export default function AdminUsersFilters({ onSearch, onRoleChange, onPremiumChange, onActiveChange }: IAdminUsersFiltersProps) {
    const [searchInput, setSearchInput] = useState('');
    const [role, setRole] = useState('');
    const [premium, setPremium] = useState('');
    const [activeStatus, setActiveStatus] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onSearchRef = useRef(onSearch);

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

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setRole(val);
        onRoleChange(val === 'Todos' ? '' : val);
    };

    const handlePremiumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setPremium(val);
        if (val === 'Todos') onPremiumChange(undefined);
        else if (val === 'Premium') onPremiumChange(true);
        else onPremiumChange(false);
    };

    const handleActiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setActiveStatus(val);
        onActiveChange(val === '' ? undefined : val === 'true');
    };

    const isRoleActive = role !== '' && role !== 'Todos';
    const isPremiumActive = premium !== '' && premium !== 'Todos';
    const isActiveStatusActive = activeStatus !== '';

    return (
        <div className="flex gap-3 mb-6 flex-wrap items-center">
            <input
                type="text"
                placeholder="Buscar por nombre, email o usuario..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="appearance-none px-4 py-2 text-sm bg-white border border-stone-200 rounded-full
                    focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-lime-600
                    hover:bg-stone-50 text-stone-600 transition-colors min-w-64 outline-none"
            />

            {/* Rol */}
            <div className="relative">
                <select
                    value={role}
                    onChange={handleRoleChange}
                    className={`${selectBase} ${isRoleActive ? selectActive : ''}`}
                >
                    <option value="Todos">Todos los roles</option>
                    <option value="ROLE_CLIENT">Cliente</option>
                    <option value="ROLE_ADMIN">Administrador</option>
                </select>
                {isRoleActive ? (
                    <button
                        type="button"
                        onClick={() => { setRole(''); onRoleChange(''); }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                    >
                        &times;
                    </button>
                ) : (
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                )}
            </div>

            {/* Premium */}
            <div className="relative">
                <select
                    value={premium}
                    onChange={handlePremiumChange}
                    className={`${selectBase} ${isPremiumActive ? selectActive : ''}`}
                >
                    <option value="Todos">Todos</option>
                    <option value="Premium">Premium</option>
                    <option value="No premium">No premium</option>
                </select>
                {isPremiumActive ? (
                    <button
                        type="button"
                        onClick={() => { setPremium(''); onPremiumChange(undefined); }}
                        className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30 text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                    >
                        &times;
                    </button>
                ) : (
                    <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
                )}
            </div>

            {/* Estado */}
            <div className="relative">
                <select
                    value={activeStatus}
                    onChange={handleActiveChange}
                    className={`${selectBase} ${isActiveStatusActive ? selectActive : ''}`}
                >
                    <option value="">Todos los estados</option>
                    <option value="true">Activos</option>
                    <option value="false">Inactivos</option>
                </select>
                {isActiveStatusActive ? (
                    <button
                        type="button"
                        onClick={() => { setActiveStatus(''); onActiveChange(undefined); }}
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
