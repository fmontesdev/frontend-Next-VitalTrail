'use client';

import {
    InformationCircleIcon,
    UserPlusIcon,
    SparklesIcon,
    MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { INotification, NotificationType } from '@/shared/interfaces/entities/notification.interface';
import { useMarkReadMutation } from '@/mutations/notificationMutation';

interface INotificationItemProps {
    notification: INotification;
}

const TYPE_CONFIG: Record<NotificationType, {
    Icon: React.ElementType;
    iconColor: string;
    iconBg: string;
}> = {
    system:       { Icon: InformationCircleIcon, iconColor: 'text-teal-700',   iconBg: 'bg-teal-100' },
    social:       { Icon: UserPlusIcon,          iconColor: 'text-blue-600',   iconBg: 'bg-blue-100' },
    subscription: { Icon: SparklesIcon,          iconColor: 'text-lime-700',   iconBg: 'bg-lime-100' },
    admin:        { Icon: MegaphoneIcon,          iconColor: 'text-amber-600',  iconBg: 'bg-amber-100' },
};

function getRelativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'Ahora mismo';
    if (mins < 60) return `Hace ${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days}d`;
    return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export default function NotificationItem({ notification }: INotificationItemProps) {
    const { id, title, description, type, isRead, createdAt } = notification;
    const { Icon, iconColor, iconBg } = TYPE_CONFIG[type] ?? TYPE_CONFIG.system;
    const markRead = useMarkReadMutation();

    const handleClick = () => {
        if (!isRead) {
            markRead.mutate(id);
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors
                ${isRead ? 'bg-white hover:bg-stone-50' : 'bg-lime-50/60 hover:bg-lime-50'}`}
        >
            {/* Icono de tipo */}
            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-0.5 ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>

            {/* Contenido */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug truncate ${isRead ? 'text-stone-600 font-normal' : 'text-stone-800 font-semibold'}`}>
                    {title}
                </p>
                <p className="text-xs text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {description}
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                    {getRelativeTime(createdAt)}
                </p>
            </div>
        </button>
    );
}
