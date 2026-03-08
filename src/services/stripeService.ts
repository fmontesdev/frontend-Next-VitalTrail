import apiService from "./apiService";
import { SessionData, CustomerData, CheckoutSessionResponse, SubscriptionData } from "@/shared/interfaces/components/stripe.interface";

export const StripeService = {
    createCheckoutSession(priceId: string, customerData?: CustomerData): Promise<CheckoutSessionResponse> {
        return apiService.post<CheckoutSessionResponse>(
            "/payments/stripe/create-checkout-session", {
                priceId,
                successUrl: `${window.location.origin}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}/premium`,
                customerData
            }, true
        ).then((data) => {
            return data;
        });
    },
    
    verifySession(sessionId: string): Promise<SessionData> {
        return apiService.get<SessionData>(`/payments/stripe/sessions/${sessionId}`, true).then((data) => {
            return data;
        });
    },

    getSubscription(customerId: string): Promise<SubscriptionData> {
        return apiService.get<SubscriptionData>(`/subscription/${customerId}`, true).then((data) => {
            return data;
        });
    },
    
    cancelSubscription(customerId: string): Promise<SubscriptionData> {
        return apiService.get<SubscriptionData>(`/payments/stripe/cancel-subscription/${customerId}`, true).then((data) => {
            return data;
        });
    }
};
