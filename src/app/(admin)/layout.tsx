'use client';

import { useAdminGuard } from '@/services/guards/useAdminGuard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopbar from '@/components/admin/AdminTopbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const currentUser = useAdminGuard();

    if (currentUser.isLoading) return <LoadingSpinner />;
    if (!currentUser.isAuthenticated || currentUser.user?.rol !== 'ROLE_ADMIN') return null;

    return (
        <div className="flex min-h-screen bg-stone-50">
            <AdminSidebar />
            <div className="flex-1 ml-64 flex flex-col min-h-screen">
                <AdminTopbar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
