'use client';

import { UsersIcon, StarIcon, MapIcon, BoltIcon, CalendarDaysIcon, CreditCardIcon, XCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAdminStats, useAdminUsersGrowth, useAdminRoutesGrowth } from '@/queries/adminQuery';
import { useAdminSubscriptionStats } from '@/queries/adminSubscriptionQuery';
import KpiCard from './KpiCard';
import UserGrowthChart from './UserGrowthChart';
import RoutesBarChart from './RoutesBarChart';
import PremiumPieChart from './PremiumPieChart';

export default function AdminDashboardClient() {
    const { data: stats, isLoading: statsLoading, isError: statsError } = useAdminStats();
    const { data: subscriptionStats, isLoading: subLoading, isError: subError } = useAdminSubscriptionStats();
    const { data: usersGrowth, isLoading: usersGrowthLoading } = useAdminUsersGrowth();
    const { data: routesGrowth, isLoading: routesGrowthLoading } = useAdminRoutesGrowth();

    if (statsLoading || subLoading) {
        return <LoadingSpinner />;
    }

    if (statsError || subError || !stats || !subscriptionStats) {
        return <p className="text-red-500">Error al cargar estadísticas</p>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-teal-700 mb-8">Dashboard</h1>

            {/* Fila 1 — Usuarios y Rutas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <KpiCard
                    label="Usuarios activos"
                    value={stats.users.total}
                    delta={`+${stats.users.newThisMonth} este mes`}
                    icon={<UsersIcon className="w-5 h-5" />}
                    valueColor="teal"
                />
                <KpiCard
                    label="Usuarios premium"
                    value={stats.users.premium}
                    delta={`${stats.users.conversionRate}% conversión`}
                    icon={<StarIcon className="w-5 h-5" />}
                    valueColor="teal"
                />
                <KpiCard
                    label="Rutas publicadas"
                    value={stats.routes.total}
                    delta={`+${stats.routes.newThisMonth} este mes`}
                    icon={<MapIcon className="w-5 h-5" />}
                />
                <KpiCard
                    label="Km registrados"
                    value={stats.sessions.totalKm.toLocaleString()}
                    delta={`${stats.sessions.total.toLocaleString()} sesiones totales`}
                    icon={<BoltIcon className="w-5 h-5" />}
                />
            </div>

            {/* Fila 2 — Sesiones + Suscripciones */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KpiCard
                    label="Sesiones totales"
                    value={stats.sessions.total}
                    icon={<CalendarDaysIcon className="w-5 h-5" />}
                />
                <KpiCard
                    label="Suscripciones"
                    value={subscriptionStats.monthly}
                    secondary={{ label: 'Anuales', value: subscriptionStats.annual, primaryLabel: 'Mensuales' }}
                    secondaryLayout="horizontal"
                    icon={<CreditCardIcon className="w-5 h-5" />}
                    valueColor="violet"
                />
                <KpiCard
                    label="Suscripciones activas"
                    value={subscriptionStats.active}
                    delta={`+${subscriptionStats.newThisMonth} este mes`}
                    icon={<CreditCardIcon className="w-5 h-5" />}
                    valueColor="violet"
                />
                <KpiCard
                    label="Cancelaciones este mes"
                    value={subscriptionStats.canceledThisMonth}
                    delta={`${subscriptionStats.churnRate}% abandono`}
                    icon={<XCircleIcon className="w-5 h-5" />}
                    variant="danger"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {usersGrowthLoading
                    ? <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex items-center justify-center h-[280px]"><LoadingSpinner /></div>
                    : <UserGrowthChart data={usersGrowth ?? []} />
                }
                {routesGrowthLoading
                    ? <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-200 flex items-center justify-center h-[280px]"><LoadingSpinner /></div>
                    : <RoutesBarChart data={routesGrowth ?? []} />
                }
                <PremiumPieChart
                    premium={stats.users.premium}
                    free={stats.users.free}
                    conversionRate={stats.users.conversionRate}
                />
            </div>
        </div>
    );
}
