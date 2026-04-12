'use client';

import { useEffect, useRef, useState } from 'react';

interface IAdminUsersFiltersProps {
    onSearch: (v: string) => void;
    onRoleChange: (v: string) => void;
    onPremiumChange: (v: boolean | undefined) => void;
    onActiveChange: (v: boolean | undefined) => void;
}

const selectBase = 'border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none shadow cursor-pointer transition-colors';
const selectInactive = 'bg-white text-gray-600 hover:bg-stone-100';
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

    return (
        <div className="flex gap-3 mb-6 flex-wrap">
            <input
                type="text"
                placeholder="Buscar por nombre, email o usuario..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none min-w-64 shadow hover:bg-stone-100"
            />
            <select
                value={role}
                onChange={handleRoleChange}
                className={`${selectBase} ${role !== '' && role !== 'Todos' ? selectActive : selectInactive}`}
            >
                <option value="Todos">Todos los roles</option>
                <option value="ROLE_CLIENT">Cliente</option>
                <option value="ROLE_ADMIN">Administrador</option>
            </select>
            <select
                value={premium}
                onChange={handlePremiumChange}
                className={`${selectBase} ${premium !== '' && premium !== 'Todos' ? selectActive : selectInactive}`}
            >
                <option value="Todos">Todos</option>
                <option value="Premium">Premium</option>
                <option value="No premium">No premium</option>
            </select>
            <select
                value={activeStatus}
                onChange={handleActiveChange}
                className={`${selectBase} ${activeStatus !== '' ? selectActive : selectInactive}`}
            >
                <option value="">Todos los estados</option>
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
            </select>
        </div>
    );
}
