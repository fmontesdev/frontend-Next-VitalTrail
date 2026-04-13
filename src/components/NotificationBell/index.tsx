'use client';

import { BellIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/queries/notificationQuery';
import { useAuth } from '@/hooks/useAuth';
import NotificationPanel from './components/NotificationPanel';

interface INotificationBellProps {
    variant?: 'default' | 'hero';
}

export default function NotificationBell({ variant = 'default' }: INotificationBellProps) {
    const { currentUser } = useAuth();
    const { data } = useNotifications(currentUser.isAuthenticated);
    const unreadCount = data?.unreadCount ?? 0;

    const iconClass = unreadCount > 0
        ? 'w-6 h-6 text-lime-500'
        : variant === 'hero'
            ? 'w-5 h-5 text-white group-hover:text-lime-400'
            : 'w-5 h-5 text-stone-600 group-hover:text-lime-500';

    const buttonClass = variant === 'hero'
        ? 'relative p-2 rounded-full hover:bg-white/20 transition-colors'
        : 'relative p-2 rounded-full hover:bg-stone-100 transition-colors';

    return (
        <div className="relative group">
            <button
                type="button"
                className={buttonClass}
                aria-label="Notificaciones"
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

            <NotificationPanel />
        </div>
    );
}
