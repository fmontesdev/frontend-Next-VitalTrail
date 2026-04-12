/**
 * Shared Tailwind class map for subscription status badges.
 * Used by AdminSubscriptionsTable and AdminSubscriptionsFilters.
 */
export const STATUS_BADGE: Record<string, string> = {
    active: 'bg-lime-100 text-lime-700',
    canceled: 'bg-red-100 text-red-600',
    past_due: 'bg-yellow-100 text-yellow-700',
};
