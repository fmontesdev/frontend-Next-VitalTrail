import apiService from './apiService';
import { SessionData, CustomerData, CheckoutSessionResponse, SubscriptionData } from '@/shared/interfaces/components/stripe.interface';

export const StripeService = {
    createCheckoutSession(priceId: string, customerData?: CustomerData): Promise<CheckoutSessionResponse> {
        return apiService.post<CheckoutSessionResponse>(
            '/payments/stripe/create-checkout-session', {
                priceId,
                successUrl: `${window.location.origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}/premium`,
                customerData
            }, true
        );
    },

    verifySession(sessionId: string): Promise<SessionData> {
        return apiService.get<SessionData>(`/payments/stripe/sessions/${sessionId}`, true);
    },

    getSubscription(customerId: string): Promise<SubscriptionData> {
        return apiService.get<SubscriptionData>(`/subscription/${customerId}`, true);
    },

    cancelSubscription(customerId: string): Promise<SubscriptionData> {
        return apiService.post<SubscriptionData>('/payments/stripe/cancel-subscription', { customerId }, true);
    },

    cancelAtPeriodEnd(customerId: string): Promise<SubscriptionData> {
        return apiService.post<SubscriptionData>('/payments/stripe/cancel-at-period-end', { customerId }, true);
    },

    reactivateSubscription(customerId: string): Promise<SubscriptionData> {
        return apiService.post<SubscriptionData>('/payments/stripe/reactivate-subscription', { customerId }, true);
    },
};
