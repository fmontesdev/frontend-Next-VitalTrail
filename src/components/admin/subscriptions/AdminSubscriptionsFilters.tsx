'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface IAdminSubscriptionsFiltersProps {
    onStatusChange: (v: string) => void;
}

const STATUS_OPTIONS = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activa' },
    { value: 'canceled', label: 'Cancelada' },
];

const selectBase = `
    appearance-none px-4 py-2 pr-8 text-sm bg-white border border-stone-200 rounded-full
    cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-lime-600
    hover:bg-stone-50 text-stone-600 transition-colors
`;
const selectActive = '!bg-lime-600/60 !text-white';

export default function AdminSubscriptionsFilters({ onStatusChange }: IAdminSubscriptionsFiltersProps) {
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setStatus(val);
        onStatusChange(val);
    };

    const isStatusActive = status !== '';

    return (
        <div className="flex gap-3 mb-6 flex-wrap items-center">
            <div className="relative">
                <select
                    value={status}
                    onChange={handleChange}
                    className={`${selectBase} ${isStatusActive ? selectActive : ''}`}
                >
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {isStatusActive ? (
                    <button
                        type="button"
                        onClick={() => { setStatus(''); onStatusChange(''); }}
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
