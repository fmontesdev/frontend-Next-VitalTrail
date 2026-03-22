import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StripeService } from '@/services/stripeService';
import { SubscriptionData } from '@/shared/interfaces/components/stripe.interface';

export const useStripeSession = (sessionId: string | null) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['stripeSession', sessionId],
        queryFn: async () => {
            if (!sessionId) return null;

            const sessionData = await StripeService.verifySession(sessionId);

            // Si la sesión es exitosa, invalidar la query de auth para que
            // Symfony devuelva el isPremium actualizado directamente desde la BD
            if (sessionData && sessionData.status === 'complete') {
                queryClient.invalidateQueries({ queryKey: ['auth'] });
            }

            return sessionData;
        },
        enabled: !!sessionId,
        staleTime: 0,
    });
}

export const useSubscription = (customerId: string | null) => {
    return useQuery<SubscriptionData>({
        queryKey: ['subscription', customerId],
        queryFn: () => {
            return customerId
                ? StripeService.getSubscription(customerId)
                : Promise.resolve(null as unknown as SubscriptionData);
        },
        enabled: !!customerId, // Solo ejecuta si hay customerId
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
