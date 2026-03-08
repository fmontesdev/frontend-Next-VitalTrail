export interface SessionData {
    sessionId: string,
    subscriptionId: string,
    subscriptionType: string,
    priceId: string,
    productId: string,
    productName: string,
    productDescription: string,
    clientReferenceId: string,
    customerId: string,
    currentPeriodStart: number,
    currentPeriodEnd: number,
    cancelAtPeriodEnd: false,
    billingInterval: string,
    priceAmount: number,
    currency: string,
    paymentStatus: string,
    subscriptionStatus: string,
    status: string,
    paymentMethodId: string,
    paymentMethodType: string,
    cardBrand: string,
    cardLast4: string,
    cardExpMonth: number,
    cardExpYear: number,
}

export interface CustomerData {
    email: string;
    customerId: string | null;
    // paymentMethodId: string | null;
}

export interface CheckoutSessionResponse {
    sessionId: string;
}

export interface SubscriptionData {
    subscriptionId: string,
    subscriptionType: string,
    billingInterval: string,
    customerId: string,
    idUser: string,
    productId: string,
    productName: string,
    priceId: string,
    currentPeriodStart: number,
    currentPeriodEnd: number,
    cancelAtPeriodEnd: false,
    cancellationReason: string,
    status: string,
    lasEventType: string,
    createdAt: string,
    updatedAt: string,
    paymentMethodId: string,
    paymentMethodType: string,
    cardBrand: string,
    cardLast4: string,
    cardExpMonth: number,
    cardExpYear: number,
}