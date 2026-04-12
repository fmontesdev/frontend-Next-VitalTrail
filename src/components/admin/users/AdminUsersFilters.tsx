'use client';

import { useEffect, useRef, useState } from 'react';
import CustomSelect, { ISelectOption } from '@/components/common/CustomSelect';

interface IAdminUsersFiltersProps {
    onSearch: (v: string) => void;
    onRoleChange: (v: string) => void;
    onPremiumChange: (v: boolean | undefined) => void;
    onActiveChange: (v: boolean | undefined) => void;
}

const ROLE_OPTIONS: ISelectOption[] = [
    { value: 'Todos', label: 'Todos los roles' },
    { value: 'ROLE_CLIENT', label: 'Cliente' },
    { value: 'ROLE_ADMIN', label: 'Administrador' },
];

const PREMIUM_OPTIONS: ISelectOption[] = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Premium', label: 'Premium' },
    { value: 'No premium', label: 'No premium' },
];

const ACTIVE_OPTIONS: ISelectOption[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'true', label: 'Activos' },
    { value: 'false', label: 'Inactivos' },
];

export default function AdminUsersFilters({ onSearch, onRoleChange, onPremiumChange, onActiveChange }: IAdminUsersFiltersProps) {
    const [searchInput, setSearchInput] = useState('');
    const [role, setRole] = useState('Todos');
    const [premium, setPremium] = useState('Todos');
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

    const handleRoleChange = (val: string) => {
        setRole(val);
        onRoleChange(val === 'Todos' ? '' : val);
    };

    const handlePremiumChange = (val: string) => {
        setPremium(val);
        if (val === 'Todos') onPremiumChange(undefined);
        else if (val === 'Premium') onPremiumChange(true);
        else onPremiumChange(false);
    };

    const handleActiveChange = (val: string) => {
        setActiveStatus(val);
        onActiveChange(val === '' ? undefined : val === 'true');
    };

    return (
        <div className="flex gap-3 mb-6 flex-wrap items-center">
            <input
                type="text"
                placeholder="Buscar por nombre, email o usuario..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="appearance-none px-4 py-2 text-sm bg-white border border-stone-200 rounded-full
                    focus:outline-none focus:border-lime-600
                    hover:bg-stone-50 text-stone-600 transition-colors min-w-64 outline-none"
            />
            <CustomSelect options={ROLE_OPTIONS} value={role} onChange={handleRoleChange} />
            <CustomSelect options={PREMIUM_OPTIONS} value={premium} onChange={handlePremiumChange} />
            <CustomSelect options={ACTIVE_OPTIONS} value={activeStatus} onChange={handleActiveChange} />
        </div>
    );
}
