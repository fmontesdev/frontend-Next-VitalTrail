import apiService from './apiService';
import { INotificationsResponse, ISendNotificationInput, ISendNotificationPayload } from '@/shared/interfaces/entities/notification.interface';

export const NotificationService = {
    getMyNotifications(): Promise<INotificationsResponse> {
        return apiService.get<INotificationsResponse>('/notifications/me');
    },

    markAsRead(id: number): Promise<void> {
        return apiService.patch<void>(`/notifications/${id}/read`);
    },

    markAllAsRead(): Promise<void> {
        return apiService.patch<void>('/notifications/read-all');
    },

    sendNotification(input: ISendNotificationInput): Promise<void> {
        const { targetingMode, ...payload } = input;
        const body: ISendNotificationPayload = {
            title: payload.title,
            description: payload.description,
            type: payload.type,
            ...(targetingMode === 'individual' && { targetUserId: payload.targetUserId }),
            ...(targetingMode === 'role' && { targetRole: payload.targetRole }),
        };
        return apiService.post<void>('/notifications', body, false, {
            headers: { 'Content-Type': 'application/ld+json' },
        });
    },
};
