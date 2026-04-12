'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAdminStats, useAdminUsers } from '@/queries/adminQuery';
import { useDeactivateAdminUser } from '@/mutations/adminMutation';
import KpiCard from '@/components/admin/dashboard/KpiCard';
import AdminUsersFilters from './AdminUsersFilters';
import AdminUsersTable from './AdminUsersTable';
import ConfirmModal from '@/components/admin/common/ConfirmModal';
import { UsersIcon, UserGroupIcon, StarIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export default function AdminUsersClient() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [isPremium, setIsPremium] = useState<boolean | undefined>(undefined);
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
    const [userToDeactivate, setUserToDeactivate] = useState<string | null>(null);

    const { data: stats } = useAdminStats();
    const { data, isLoading, isError } = useAdminUsers(page, 10, search || undefined, role || undefined, isPremium, isActive);
    const deactivateUser = useDeactivateAdminUser();

    const handleSearch = (v: string) => {
        setSearch(v);
        setPage(1);
    };

    const handleRoleChange = (v: string) => {
        setRole(v);
        setPage(1);
    };

    const handlePremiumChange = (v: boolean | undefined) => {
        setIsPremium(v);
        setPage(1);
    };

    const handleActiveChange = (v: boolean | undefined) => {
        setIsActive(v);
        setPage(1);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-teal-700 mb-6">Usuarios</h1>

            {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <KpiCard label="Total usuarios" value={stats.users.total} icon={<UsersIcon className="w-5 h-5" />} valueColor="teal" />
                    <KpiCard label="Usuarios activos" value={stats.users.total} icon={<UserGroupIcon className="w-5 h-5" />} valueColor="teal" />
                    <KpiCard label="Usuarios premium" value={stats.users.premium} icon={<StarIcon className="w-5 h-5" />} valueColor="teal" />
                    <KpiCard label="Nuevos este mes" value={stats.users.newThisMonth} icon={<UserPlusIcon className="w-5 h-5" />} valueColor="teal" />
                </div>
            )}

            <AdminUsersFilters
                onSearch={handleSearch}
                onRoleChange={handleRoleChange}
                onPremiumChange={handlePremiumChange}
                onActiveChange={handleActiveChange}
            />
            {isLoading && <LoadingSpinner />}
            {isError && <p className="text-red-500 text-sm">Error al cargar usuarios</p>}
            {!isLoading && !isError && data && (
                <AdminUsersTable
                    users={data.users}
                    total={data.total}
                    page={page}
                    limit={10}
                    onPageChange={setPage}
                    onDeactivate={setUserToDeactivate}
                    isDeactivating={deactivateUser.isPending}
                />
            )}

            <ConfirmModal
                isOpen={!!userToDeactivate}
                title="¿Desactivar usuario?"
                message="Esta acción desactivará la cuenta del usuario. Puede reactivarse más adelante."
                confirmLabel="Desactivar"
                cancelLabel="Cancelar"
                variant="warning"
                onConfirm={() => {
                    if (userToDeactivate) deactivateUser.mutate(userToDeactivate);
                    setUserToDeactivate(null);
                }}
                onCancel={() => setUserToDeactivate(null)}
            />
        </div>
    );
}
