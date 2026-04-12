'use client';

import Image from 'next/image';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { IAdminSubscriptionItem } from '@/shared/interfaces/entities/adminSubscription.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';
import { STATUS_BADGE } from './subscriptionStatusBadge';
import AdminTablePaginator from '@/components/admin/common/AdminTablePaginator';

interface IAdminSubscriptionsTableProps {
    subscriptions: IAdminSubscriptionItem[];
    total: number;
    page: number;
    size: number;
    onPageChange: (p: number) => void;
    onCancel?: (customerId: string) => void;
    onReactivate?: (customerId: string) => void;
}

const STATUS_LABEL: Record<string, string> = {
    active: 'Activa',
    canceled: 'Cancelada',
    past_due: 'Vencida',
};

const TYPE_LABEL: Record<string, string> = {
    monthly: 'Mensual',
    annual: 'Anual',
};

export default function AdminSubscriptionsTable({
    subscriptions,
    total,
    page,
    size,
    onPageChange,
    onCancel,
    onReactivate,
}: IAdminSubscriptionsTableProps) {
    const totalPages = Math.ceil(total / size);
    const from = total > 0 ? (page - 1) * size + 1 : 0;
    const to = Math.min(page * size, total);

    return (
        <div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-teal-50 text-teal-700 uppercase text-xs border-b border-teal-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Usuario</th>
                            <th className="px-4 py-3 text-left">Plan</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Próxima renovación</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {subscriptions.map(item => (
                            <tr key={item.subscriptionId} className="hover:bg-stone-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={getImageUrl('avatar', item.user.imgUser)}
                                            alt={item.user.username}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{item.user.name} {item.user.surname}</p>
                                            <p className="text-xs text-gray-400">{item.user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-700">
                                    {TYPE_LABEL[item.subscriptionType] ?? item.subscriptionType}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                        STATUS_BADGE[item.status] ?? 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {STATUS_LABEL[item.status] ?? item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {item.cancelAtPeriodEnd === false
                                        ? new Date(item.currentPeriodEnd * 1000).toLocaleDateString('es-ES')
                                        : <span className="text-red-500 text-xs">Cancela al vencer</span>
                                    }
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {item.status === 'active' && item.cancelAtPeriodEnd === false && onCancel && (
                                            <button
                                                onClick={() => onCancel(item.customerId)}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 border border-red-600/20 text-red-600 hover:bg-red-200 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                        {/* Reactivar: solo cuando activa pero programada para cancelar al vencer */}
                                        {item.status === 'active' && item.cancelAtPeriodEnd === true && onReactivate && (
                                            <button
                                                onClick={() => onReactivate(item.customerId)}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-lime-100 text-lime-700 hover:bg-lime-200 transition-colors"
                                            >
                                                Reactivar
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {subscriptions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3 text-stone-400">
                                        <CreditCardIcon className="w-10 h-10" />
                                        <span className="text-sm font-medium">No se encontraron suscripciones</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <AdminTablePaginator
                displayFrom={from}
                displayTo={to}
                total={total}
                entityLabel="suscripciones"
                prevDisabled={page <= 1}
                nextDisabled={page >= totalPages}
                onPrev={() => onPageChange(page - 1)}
                onNext={() => onPageChange(page + 1)}
            />
        </div>
    );
}
