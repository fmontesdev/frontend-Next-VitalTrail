import apiService from './apiService';
import { IAdminSubscriptionStats, IAdminSubscriptionsPage } from '@/shared/interfaces/entities/adminSubscription.interface';

/**
 * Admin subscription service — Spring Boot API.
 * Pagination convention: Spring Boot uses 0-based pages internally.
 * This service accepts 1-based page numbers (consistent with the rest of the admin)
 * and converts to 0-based before sending to the backend.
 */
export const AdminSubscriptionService = {
    getStats(): Promise<IAdminSubscriptionStats> {
        return apiService.get<IAdminSubscriptionStats>('/admin/subscriptions/stats', true);
    },

    getSubscriptions(page: number, size: number, status?: string): Promise<IAdminSubscriptionsPage> {
        const params = new URLSearchParams();
        params.set('page', String(page - 1)); // convert 1-based → 0-based for Spring Boot
        params.set('size', String(size));
        if (status) params.set('status', status);
        return apiService.get<IAdminSubscriptionsPage>(`/admin/subscriptions?${params.toString()}`, true);
    },
};
