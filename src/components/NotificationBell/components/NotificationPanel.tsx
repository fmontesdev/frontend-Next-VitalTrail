'use client';

import { BellSlashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/queries/notificationQuery';
import { useMarkAllReadMutation } from '@/mutations/notificationMutation';
import NotificationItem from './NotificationItem';

interface INotificationPanelProps {
    onClose: () => void;
}

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
            rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: '420px' }}
        >
            {/* Header del panel */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-stone-800">Notificaciones</span>
                    {hasUnread && (
                        <span className="text-[11px] font-bold bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">
                            {unreadCount} nueva{unreadCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {hasUnread && (
                    <button
                        type="button"
                        onClick={handleMarkAll}
                        disabled={markAll.isPending}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors disabled:opacity-50"
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
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <BellSlashIcon className="w-10 h-10 text-stone-300 mb-3" />
                        <p className="text-sm font-medium text-stone-500">No tenés notificaciones pendientes</p>
                        <p className="text-xs text-stone-400 mt-1">Te avisaremos cuando haya novedades</p>
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
