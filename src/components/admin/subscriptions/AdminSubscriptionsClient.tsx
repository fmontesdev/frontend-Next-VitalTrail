'use client';

import { useState } from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAdminSubscriptionStats, useAdminSubscriptions } from '@/queries/adminSubscriptionQuery';
import { useCancelAdminSubscription, useReactivateAdminSubscription } from '@/mutations/adminSubscriptionMutation';
import KpiCard from '@/components/admin/dashboard/KpiCard';
import AdminSubscriptionsFilters from './AdminSubscriptionsFilters';
import AdminSubscriptionsTable from './AdminSubscriptionsTable';
import ConfirmModal from '@/components/admin/common/ConfirmModal';
import { CreditCardIcon, CalendarIcon, PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AdminSubscriptionsClient() {
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState('');
    const [subToCancel, setSubToCancel] = useState<string | null>(null);
    const [subToReactivate, setSubToReactivate] = useState<string | null>(null);

    const { data: subStats, isLoading: statsLoading } = useAdminSubscriptionStats();
    const { data, isLoading, isError } = useAdminSubscriptions(page, 10, status || undefined);

    const cancelSubscription = useCancelAdminSubscription();
    const reactivateSubscription = useReactivateAdminSubscription();

    const handleStatusChange = (v: string) => {
        setStatus(v);
        setPage(1);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-teal-700 mb-6">Suscripciones</h1>

            {statsLoading && <LoadingSpinner />}
            {!statsLoading && subStats && (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    <KpiCard label="Activas" value={subStats.active} icon={<CreditCardIcon className="w-5 h-5" />} valueColor="violet" />
                    <KpiCard
                        label="Suscripciones"
                        value={subStats.monthly}
                        icon={<CalendarIcon className="w-5 h-5" />}
                        secondary={{ label: 'Anuales', value: subStats.annual, primaryLabel: 'Mensuales' }}
                        secondaryLayout="horizontal"
                        valueColor="violet"
                    />
                    <KpiCard label="Nuevas este mes" value={subStats.newThisMonth} icon={<PlusCircleIcon className="w-5 h-5" />} valueColor="violet" />
                    <KpiCard label="Canceladas este mes" value={subStats.canceledThisMonth} icon={<XCircleIcon className="w-5 h-5" />} variant="danger" />
                </div>
            )}

            <AdminSubscriptionsFilters onStatusChange={handleStatusChange} />

            {isLoading && <LoadingSpinner />}
            {isError && <p className="text-red-500 text-sm">Error al cargar suscripciones</p>}
            {!isLoading && !isError && data && (
                <AdminSubscriptionsTable
                    subscriptions={data.subscriptions}
                    total={data.total}
                    page={page}
                    size={10}
                    onPageChange={setPage}
                    onCancel={setSubToCancel}
                    onReactivate={setSubToReactivate}
                />
            )}

            <ConfirmModal
                isOpen={!!subToCancel}
                title="¿Cancelar suscripción?"
                message="La suscripción se cancelará al final del período actual. El usuario seguirá teniendo acceso hasta entonces."
                confirmLabel="Cancelar suscripción"
                cancelLabel="Mantener"
                variant="warning"
                onConfirm={() => {
                    if (subToCancel) cancelSubscription.mutate(subToCancel);
                    setSubToCancel(null);
                }}
                onCancel={() => setSubToCancel(null)}
            />

            <ConfirmModal
                isOpen={!!subToReactivate}
                title="¿Reactivar suscripción?"
                message="La suscripción se reactivará y se renovará automáticamente al final del período actual."
                confirmLabel="Reactivar suscripción"
                cancelLabel="Cancelar"
                variant="danger"
                onConfirm={() => {
                    if (subToReactivate) reactivateSubscription.mutate(subToReactivate);
                    setSubToReactivate(null);
                }}
                onCancel={() => setSubToReactivate(null)}
            />
        </div>
    );
}

