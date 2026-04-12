'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminSubscriptionKeys } from '@/queries/adminSubscriptionQuery';
import { StripeService } from '@/services/stripeService';

export const useCancelAdminSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (customerId: string) => StripeService.cancelAtPeriodEnd(customerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.stats() });
            queryClient.invalidateQueries({ queryKey: ['admin', 'subscriptions'] }); // prefix invalidation covers list
        },
    });
};

export const useReactivateAdminSubscription = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (customerId: string) => StripeService.reactivateSubscription(customerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminSubscriptionKeys.stats() });
            queryClient.invalidateQueries({ queryKey: ['admin', 'subscriptions'] }); // prefix invalidation covers list
        },
    });
};

