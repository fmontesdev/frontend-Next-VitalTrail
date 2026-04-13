import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notificationService';
import { notificationKeys } from '@/queries/notificationQuery';
import { ISendNotificationInput } from '@/shared/interfaces/entities/notification.interface';

export const useMarkReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (id: number) => NotificationService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.mine() });
        },
    });
};

export const useMarkAllReadMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, void>({
        mutationFn: () => NotificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.mine() });
        },
    });
};

export const useSendNotificationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, ISendNotificationInput>({
        mutationFn: (data: ISendNotificationInput) => NotificationService.sendNotification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKeys.mine() });
        },
    });
};
