import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StripeService } from '@/services/stripeService';
import { SubscriptionData } from '@/shared/interfaces/components/stripe.interface';
import { IUser } from '@/shared/interfaces/entities/user.interface';

export const useStripeSession = (sessionId: string | null) => {
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['stripeSession', sessionId],
        queryFn: async () => {
            if (!sessionId) return null;
            
            const sessionData = await StripeService.verifySession(sessionId);
            
            // Si la sesión es exitosa, actualizar el estado de autenticación
            if (sessionData && sessionData.status === 'complete') {
                // Invalidar la consulta de usuario para forzar una recarga
                // queryClient.invalidateQueries({ queryKey: ['currentUser'] });
                
                const authData = queryClient.getQueryData<{ user: IUser }>(['auth']);
                if (authData) {
                    queryClient.setQueryData(['auth'], {
                        ...authData,
                        user: {
                            ...authData.user,
                            isPremium: true
                        }
                    });
                }
            }
            
            return sessionData;
        },
        enabled: !!sessionId, // Solo ejecuta si hay un sessionId
        staleTime: 0,
    });
}

export const useSubscription = (customerId: string | null) => {
    return useQuery<SubscriptionData>({
        queryKey: ['subscription', customerId],
        queryFn: () => customerId ? StripeService.getSubscription(customerId) : Promise.resolve(null as unknown as SubscriptionData),
        enabled: !!customerId, // Solo ejecuta si hay customerId
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
};
