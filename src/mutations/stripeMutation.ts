import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StripeService } from '@/services/stripeService';
import { loadStripe } from '@stripe/stripe-js';
import { CustomerData, SubscriptionData } from '@/shared/interfaces/components/stripe.interface';

// Clave publicable de Stripe
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const useCreateCheckoutSession = () => {
    return useMutation({
        mutationFn: async ({
            priceId,
            customerData
        }: {
            priceId: string,
            customerData?: CustomerData
        }) => {
            const { sessionId } = await StripeService.createCheckoutSession(priceId, customerData);

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('No se pudo cargar Stripe');
            }

            return stripe.redirectToCheckout({ sessionId });
        },
    });
};

// Helper compartido por las tres mutations de gestión de suscripción.
// El backend devuelve cancelAtPeriodEnd sin refrescar tras el cambio,
// por eso se fuerza el valor esperado directamente en la caché.
const useSubscriptionMutation = (
    mutationFn: (customerId: string) => Promise<SubscriptionData>,
    expectedCancelAtPeriodEnd: boolean
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: (_data, customerId) => {
            const current = queryClient.getQueryData<SubscriptionData>(['subscription', customerId]);
            if (current) {
                queryClient.setQueryData<SubscriptionData>(['subscription', customerId], {
                    ...current,
                    cancelAtPeriodEnd: expectedCancelAtPeriodEnd,
                });
            }
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        },
    });
};

export const useCancelSubscription = () =>
    useSubscriptionMutation(StripeService.cancelSubscription.bind(StripeService), false);

export const useCancelAtPeriodEnd = () =>
    useSubscriptionMutation(StripeService.cancelAtPeriodEnd.bind(StripeService), true);

export const useReactivateSubscription = () =>
    useSubscriptionMutation(StripeService.reactivateSubscription.bind(StripeService), false);
