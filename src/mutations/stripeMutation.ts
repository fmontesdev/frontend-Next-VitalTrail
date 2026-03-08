import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StripeService } from '@/services/stripeService';
import { loadStripe } from '@stripe/stripe-js';
import { CustomerData } from '@/shared/interfaces/components/stripe.interface';
import { IUser } from '@/shared/interfaces/entities/user.interface';

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
            // Crear sesión de checkout
            const { sessionId } = await StripeService.createCheckoutSession(priceId, customerData);
            
            // Redireccionar a Stripe Checkout
            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error('No se pudo cargar Stripe');
            }
            
            return stripe.redirectToCheckout({ sessionId });
        },
        onError: (error) => {
            console.error('Error creando sesión de checkout:', error);
        }
    });
};

export const useCancelSubscription = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (customerId: string) => StripeService.cancelSubscription(customerId),
        onSuccess: (data, customerId) => {
            // Actualizar la cache con los datos más recientes
            queryClient.setQueryData(['subscription', customerId], data);
            
            // // Invalidar cualquier query que pueda depender de esta información
            // queryClient.invalidateQueries({ 
            //     queryKey: ['subscription']
            // });

            // // Importante: actualizar o invalidar el estado del usuario
            // queryClient.invalidateQueries({ queryKey: ['currentUser'] });
            
            // Actualizar directamente el estado
            const authData = queryClient.getQueryData<{ user: IUser }>(['auth']);
            if (authData) {
                queryClient.setQueryData(['auth'], {
                    ...authData,
                    user: {
                        ...authData.user,
                        isPremium: false
                    }
                });
            }
        },
        onError: (error) => {
            console.error('Error cancelando suscripción:', error);
        }
    });
};
