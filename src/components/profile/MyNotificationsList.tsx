'use client';

import { useState } from 'react';
import { BellSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/queries/notificationQuery';
import { useMarkAllReadMutation } from '@/mutations/notificationMutation';
import { useAuth } from '@/hooks/useAuth';
import NotificationItem from '@/components/NotificationBell/components/NotificationItem';

type FilterMode = 'all' | 'unread';

function NotificationSkeleton() {
    return (
        <div className="flex items-start gap-3 px-4 py-3 animate-pulse">
            <div className="shrink-0 w-9 h-9 rounded-full bg-stone-100" />
            <div className="flex-1 space-y-2">
                <div className="h-3 bg-stone-100 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-full" />
                <div className="h-2 bg-stone-100 rounded w-1/4" />
            </div>
        </div>
    );
}

export default function MyNotificationsList() {
    const { currentUser } = useAuth();
    const [filter, setFilter] = useState<FilterMode>('all');

    const { data, isLoading, isError, refetch } = useNotifications(currentUser.isAuthenticated);
    const markAll = useMarkAllReadMutation();

    const notifications = data?.notifications ?? [];
    const unreadCount = data?.unreadCount ?? 0;

    const displayed = filter === 'all'
        ? notifications
        : notifications.filter((n) => !n.isRead);

    const handleMarkAll = () => {
        if (unreadCount > 0) {
            markAll.mutate();
        }
    };

    return (
        <div className="w-3/4 h-auto bg-stone-100 border border-stone-200 rounded-2xl px-7 py-4">
            {/* Tabs y acciones */}
            <div className="flex items-center justify-between border-b border-stone-200 mb-4">
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={() => setFilter('all')}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                            filter === 'all'
                                ? 'text-teal-700 border-b-2 border-teal-700'
                                : 'text-stone-500 hover:text-stone-700'
                        }`}
                    >
                        Todas
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter('unread')}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                            filter === 'unread'
                                ? 'text-teal-700 border-b-2 border-teal-700'
                                : 'text-stone-500 hover:text-stone-700'
                        }`}
                    >
                        No leídas
                        {unreadCount > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold bg-lime-600 text-white rounded-full px-1 leading-none">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                </div>

                <button
                    type="button"
                    onClick={handleMarkAll}
                    disabled={unreadCount === 0 || markAll.isPending}
                    className={`text-xs font-medium transition-colors ${
                        unreadCount > 0
                            ? 'text-teal-700 hover:underline'
                            : 'text-stone-300 cursor-not-allowed'
                    } disabled:opacity-50`}
                >
                    Marcar todas
                </button>
            </div>

            {/* Contenido */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden divide-y divide-stone-100">
                {/* Skeleton */}
                {isLoading && (
                    <>
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                    </>
                )}

                {/* Error */}
                {!isLoading && isError && (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <ExclamationCircleIcon className="w-10 h-10 text-red-300 mb-3" />
                        <p className="text-sm font-medium text-stone-500">Error al cargar las notificaciones</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-3 text-sm text-lime-700 hover:text-lime-800 font-medium transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {/* Empty — no notifications at all */}
                {!isLoading && !isError && filter === 'all' && notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <BellSlashIcon className="w-10 h-10 text-stone-300 mb-3" />
                        <p className="text-sm font-medium text-stone-500">No tienes notificaciones</p>
                        <p className="text-xs text-stone-400 mt-1">Te avisaremos cuando haya novedades</p>
                    </div>
                )}

                {/* Empty — no unread */}
                {!isLoading && !isError && filter === 'unread' && unreadCount === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <BellSlashIcon className="w-10 h-10 text-stone-300 mb-3" />
                        <p className="text-sm font-medium text-stone-500">No tienes notificaciones pendientes</p>
                        <p className="text-xs text-stone-400 mt-1">¡Estás al día con todo!</p>
                    </div>
                )}

                {/* List */}
                {!isLoading && !isError && displayed.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                ))}
            </div>
        </div>
    );
}
