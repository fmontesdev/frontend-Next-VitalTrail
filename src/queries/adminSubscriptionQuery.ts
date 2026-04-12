'use client';

import { useQuery } from '@tanstack/react-query';
import { AdminSubscriptionService } from '@/services/adminSubscriptionService';

export const adminSubscriptionKeys = {
    stats: () => ['admin', 'subscriptions', 'stats'] as const,
    list: (page: number, size: number, status?: string) =>
        ['admin', 'subscriptions', { page, size, status }] as const,
};

export const useAdminSubscriptionStats = () => {
    return useQuery({
        queryKey: adminSubscriptionKeys.stats(),
        queryFn: AdminSubscriptionService.getStats,
        staleTime: 1000 * 60 * 5,
    });
};

export const useAdminSubscriptions = (page: number, size: number, status?: string) => {
    return useQuery({
        queryKey: adminSubscriptionKeys.list(page, size, status),
        queryFn: () => AdminSubscriptionService.getSubscriptions(page, size, status),
        staleTime: 1000 * 30,
    });
};
