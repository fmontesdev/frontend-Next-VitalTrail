'use client';

import { BellSlashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/queries/notificationQuery';
import { useMarkAllReadMutation } from '@/mutations/notificationMutation';
import NotificationItem from './NotificationItem';

interface INotificationPanelProps {}

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

export default function NotificationPanel(_props: INotificationPanelProps) {
    const { data, isLoading } = useNotifications();
    const markAll = useMarkAllReadMutation();

    const notifications = data?.notifications ?? [];
    const unreadCount = data?.unreadCount ?? 0;
    const unread = notifications.filter((n) => !n.isRead);
    const hasUnread = unread.length > 0;

    const handleMarkAll = () => {
        if (hasUnread) {
            markAll.mutate();
        }
    };

    return (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-stone-200
            rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col
            invisible opacity-0 group-hover:visible group-hover:opacity-100
            transition-all duration-150"
            style={{ maxHeight: '420px' }}
        >
            {/* Header del panel */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-800">Notificaciones</span>
                    {hasUnread && (
                        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold bg-lime-600 text-white rounded-full px-1 leading-none">
                            {unreadCount}
                        </span>
                    )}
                </div>

                {hasUnread && (
                    <button
                        type="button"
                        onClick={handleMarkAll}
                        disabled={markAll.isPending}
                        className="text-xs text-teal-700 hover:underline font-medium transition-colors disabled:opacity-50"
                    >
                        Marcar todas
                    </button>
                )}
            </div>

            {/* Lista */}
            <div className="overflow-y-auto flex-1 divide-y divide-stone-100">
                {isLoading && (
                    <>
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                    </>
                )}

                {!isLoading && unread.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 py-5 px-4 text-center">
                        <BellSlashIcon className="w-8 h-8 text-stone-300" />
                        <p className="text-sm text-stone-400">No tienes notificaciones</p>
                    </div>
                )}

                {!isLoading && unread.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                    />
                ))}
            </div>
        </div>
    );
}
