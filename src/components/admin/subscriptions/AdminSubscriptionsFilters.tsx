'use client';

import { useState } from 'react';

interface IAdminSubscriptionsFiltersProps {
    onStatusChange: (v: string) => void;
}

const STATUS_OPTIONS = [
    { value: '', label: 'Todos' },
    { value: 'active', label: 'Activa' },
    { value: 'canceled', label: 'Cancelada' },
];

const selectBase = 'border border-stone-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-lime-600 focus:border-lime-600 outline-none shadow cursor-pointer transition-colors';
const selectInactive = 'bg-white text-gray-600 hover:bg-stone-100';
const selectActive = '!bg-lime-600/60 !text-white';

export default function AdminSubscriptionsFilters({ onStatusChange }: IAdminSubscriptionsFiltersProps) {
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setStatus(val);
        onStatusChange(val);
    };

    return (
        <div className="flex gap-3 mb-6 flex-wrap items-center">
            <select
                value={status}
                onChange={handleChange}
                className={`${selectBase} ${status !== '' ? selectActive : selectInactive}`}
            >
                {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
