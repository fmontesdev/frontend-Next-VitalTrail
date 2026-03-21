'use client';

import { usePremiumGuard } from '@/services/guards/usePremiumGuard';
import CreateRouteWizard from '@/components/createRoute/CreateRouteWizard';
import { getImageUrl } from '@/shared/utils/imageUrl';

export default function CreateRoutePage() {
    const { currentUser, isPremium } = usePremiumGuard();

    // Mientras carga o redirige, mostrar spinner centrado
    if (
        currentUser.isLoading ||
        isPremium === null ||
        !currentUser.isAuthenticated ||
        isPremium === false
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600" />
            </div>
        );
    }

    return (
        <main
            className="flex-1 flex items-center justify-center py-8 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${getImageUrl('background', 'create_route.png')})` }}
        >
            <div className="w-full max-w-4xl px-4">
                <CreateRouteWizard />
            </div>
        </main>
    );
}
