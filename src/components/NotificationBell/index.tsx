'use client';

import { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import { useNotifications } from '@/queries/notificationQuery';
import { useAuth } from '@/hooks/useAuth';
import NotificationPanel from './components/NotificationPanel';

interface INotificationBellProps {
    variant?: 'default' | 'hero';
}

export default function NotificationBell({ variant = 'default' }: INotificationBellProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { currentUser } = useAuth();
    const { data } = useNotifications(currentUser.isAuthenticated);
    const unreadCount = data?.unreadCount ?? 0;

    // Cerrar al hacer clic fuera del componente
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const iconClass = variant === 'hero'
        ? 'w-5 h-5 text-white'
        : 'w-5 h-5 text-stone-600';

    const buttonClass = variant === 'hero'
        ? 'relative p-2 rounded-full hover:bg-white/20 transition-colors'
        : 'relative p-2 rounded-full hover:bg-stone-100 transition-colors';

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={buttonClass}
                aria-label="Notificaciones"
                aria-expanded={isOpen}
            >
                {unreadCount > 0 ? (
                    <BellAlertIcon className={iconClass} />
                ) : (
                    <BellIcon className={iconClass} />
                )}

                {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px]
                        bg-lime-600 text-white text-[10px] font-bold rounded-full
                        flex items-center justify-center px-1 leading-none">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <NotificationPanel onClose={() => setIsOpen(false)} />
            )}
        </div>
    );
}
