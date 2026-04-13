export type NotificationType = 'system' | 'social' | 'subscription' | 'admin';

export interface INotification {
    id: number;
    title: string;
    description: string;
    type: NotificationType;
    isRead: boolean;
    readAt: string | null;
    createdAt: string;
}

export interface INotificationsResponse {
    notifications: INotification[];
    unreadCount: number;
}

export type TargetingMode = 'broadcast' | 'role' | 'individual';

export interface ISendNotificationInput {
    title: string;
    description: string;
    type: NotificationType;
    targetingMode: TargetingMode;
    targetUserId?: string;
    targetRole?: string;
}

export interface ISendNotificationPayload {
    title: string;
    description: string;
    type: NotificationType;
    targetUserId?: string;
    targetRole?: string;
}
