'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useAdminUsers } from '@/queries/adminQuery';

interface IUserSearchSelectProps {
    onSelect: (userId: string, displayName: string) => void;
    fieldError?: string;
}

export default function UserSearchSelect({ onSelect, fieldError }: IUserSearchSelectProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const enabled = debouncedQuery.length >= 2;
    const { data, isLoading, isError } = useAdminUsers(
        1,
        10,
        enabled ? debouncedQuery : undefined,
        undefined,
        undefined,
        undefined,
        enabled,
    );
    const users = useMemo(
        () => (enabled ? (data?.users ?? []) : []),
        [enabled, data?.users],
    );

    useEffect(() => {
        if (enabled && users.length > 0) {
            setIsOpen(true);
        } else if (!enabled) {
            setIsOpen(false);
        }
    }, [users, enabled]);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (userId: string, displayName: string) => {
        setSelectedUser({ id: userId, name: displayName });
        setQuery('');
        setDebouncedQuery('');
        setIsOpen(false);
        onSelect(userId, displayName);
    };

    const handleClear = () => {
        setSelectedUser(null);
        setQuery('');
        setDebouncedQuery('');
        setIsOpen(false);
        onSelect('', '');
    };

    return (
        <div ref={containerRef} className="relative">
            {selectedUser ? (
                <div className="flex items-center justify-between px-3 py-2 border border-stone-300 rounded-lg bg-stone-50">
                    <span className="text-sm text-stone-700">{selectedUser.name}</span>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-xs text-stone-400 hover:text-stone-600 ml-2"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar usuario por nombre o email..."
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-600 ${
                        fieldError ? 'border-red-400' : 'border-stone-300'
                    }`}
                />
            )}

            {fieldError && (
                <p className="mt-1 text-xs text-red-500">{fieldError}</p>
            )}

            {!selectedUser && isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {isLoading && (
                        <div className="px-3 py-2 text-sm text-stone-400">Buscando...</div>
                    )}
                    {isError && (
                        <div className="px-3 py-2 text-sm text-red-500">Error al buscar usuarios</div>
                    )}
                    {!isLoading && !isError && users.length === 0 && debouncedQuery.length >= 2 && (
                        <div className="px-3 py-2 text-sm text-stone-400">Sin resultados</div>
                    )}
                    {!isLoading && users.map((user) => (
                        <button
                            key={user.idUser}
                            type="button"
                            onMouseDown={() => handleSelect(user.idUser, `${user.name} ${user.surname}`)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-0"
                        >
                            <span className="font-medium text-stone-700">{user.name} {user.surname}</span>
                            <span className="ml-2 text-stone-400 text-xs">{user.email}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
