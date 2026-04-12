'use client';

import { useState } from 'react';
import CustomSelect, { ISelectOption } from '@/components/common/CustomSelect';

interface IAdminSubscriptionsFiltersProps {
    onStatusChange: (v: string) => void;
}

const STATUS_OPTIONS: ISelectOption[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activa' },
    { value: 'canceled', label: 'Cancelada' },
];

export default function AdminSubscriptionsFilters({ onStatusChange }: IAdminSubscriptionsFiltersProps) {
    const [status, setStatus] = useState('');

    const handleChange = (val: string) => {
        setStatus(val);
        onStatusChange(val);
    };

    return (
        <div className="flex gap-3 mb-6 flex-wrap items-center">
            <CustomSelect options={STATUS_OPTIONS} value={status} onChange={handleChange} />
        </div>
    );
}
