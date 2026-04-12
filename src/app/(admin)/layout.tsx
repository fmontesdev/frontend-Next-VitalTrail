'use client';

import { useAdminGuard } from '@/services/guards/useAdminGuard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const currentUser = useAdminGuard();

    if (currentUser.isLoading) return <LoadingSpinner />;
    if (!currentUser.isAuthenticated || currentUser.user?.rol !== 'ROLE_ADMIN') return null;

    return (
        <div className="flex min-h-screen bg-stone-50">
            <AdminSidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
