'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface ISelectOption {
    value: string;
    label: string;
}

interface ICustomSelectProps {
    options: ISelectOption[];
    value: string;
    onChange: (value: string) => void;
}

export default function CustomSelect({ options, value, onChange }: ICustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const defaultValue = options[0]?.value ?? '';
    const isActive = value !== defaultValue;
    const selectedLabel = options.find(o => o.value === value)?.label ?? options[0]?.label ?? '';

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
    };

    return (
        <div ref={ref} className="relative" onKeyDown={handleKeyDown}>

            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`flex items-center pl-4 pr-8 py-2 text-sm rounded-full border transition-colors
                    focus:outline-none focus:border-lime-600
                    cursor-pointer whitespace-nowrap
                    ${isActive
                        ? 'bg-lime-600/60 text-white border-lime-600/60'
                        : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                    }`}
            >
                {selectedLabel}
            </button>

            {/* Clear / Chevron */}
            {isActive ? (
                <button
                    type="button"
                    onClick={() => onChange(defaultValue)}
                    className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/30
                        text-white text-lg font-medium flex items-center justify-center hover:bg-white/50"
                >
                    &times;
                </button>
            ) : (
                <ChevronDownIcon
                    className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5
                        text-stone-400 pointer-events-none transition-transform duration-150
                        ${open ? 'rotate-180' : ''}`}
                />
            )}

            {/* Dropdown panel */}
            {open && (
                <ul className="absolute top-full mt-1.5 left-0 min-w-full w-max bg-white border border-stone-200
                    rounded-2xl shadow-lg z-50 py-1.5 overflow-hidden">
                    {options.map(option => (
                        <li key={option.value}>
                            <button
                                type="button"
                                onClick={() => { onChange(option.value); setOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors
                                    ${option.value === value
                                        ? 'bg-lime-50 text-lime-700 font-medium'
                                        : 'text-stone-600 hover:bg-stone-50'
                                    }`}
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
