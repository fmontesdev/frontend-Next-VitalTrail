export interface IAdminSubscriptionStats {
    active: number;
    monthly: number;
    annual: number;
    newThisMonth: number;
    canceledThisMonth: number;
    churnRate: number;
}

export interface IAdminSubscriptionUser {
    username: string;
    email: string;
    imgUser: string;
    name: string;
    surname: string;
}

export interface IAdminSubscriptionItem {
    subscriptionId: string;
    status: string;
    subscriptionType: string;
    billingInterval: string;
    productName: string;
    currentPeriodEnd: number;
    cancelAtPeriodEnd: boolean;
    customerId: string;
    user: IAdminSubscriptionUser;
}

export interface IAdminSubscriptionsPage {
    subscriptions: IAdminSubscriptionItem[];
    total: number;
    page: number;
    size: number;
}
