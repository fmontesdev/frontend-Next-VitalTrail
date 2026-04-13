import { useQuery } from '@tanstack/react-query';
import { NotificationService } from '@/services/notificationService';
import { INotificationsResponse } from '@/shared/interfaces/entities/notification.interface';

export const notificationKeys = {
    all: ['notifications'] as const,
    mine: () => [...notificationKeys.all, 'me'] as const,
};

export const useNotifications = (enabled: boolean = true) => {
    return useQuery<INotificationsResponse>({
        queryKey: notificationKeys.mine(),
        queryFn: () => NotificationService.getMyNotifications(),
        refetchInterval: 30_000,   // polling cada 30 segundos
        staleTime: 20_000,
        enabled,
    });
};
