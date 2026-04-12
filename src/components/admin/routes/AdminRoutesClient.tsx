'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusIcon, MapIcon, PlusCircleIcon, BoltIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useAdminStats } from '@/queries/adminQuery';
import { useFilteredRoutes } from '@/queries/routeQuery';
import { useDeleteAdminRoute } from '@/mutations/adminMutation';
import KpiCard from '@/components/admin/dashboard/KpiCard';
import AdminRoutesFilters from './AdminRoutesFilters';
import AdminRoutesTable from './AdminRoutesTable';
import ConfirmModal from '@/components/admin/common/ConfirmModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const LIMIT = 10;

export default function AdminRoutesClient() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState<'createdAt' | 'favoritesCount'>('createdAt');
    const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

    const { data: stats } = useAdminStats();
    const { data, isLoading, isError } = useFilteredRoutes({
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        title: search || undefined,
        category: category || undefined,
        sortBy,
        order: 'desc',
    });
    const deleteRoute = useDeleteAdminRoute();

    const handleSearch = (v: string) => {
        setSearch(v);
        setPage(1);
    };

    const handleCategoryChange = (v: string) => {
        setCategory(v);
        setPage(1);
    };

    const handleSortChange = (v: string) => {
        setSortBy(v as 'createdAt' | 'favoritesCount');
        setPage(1);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-teal-700">Rutas</h1>
                <Link
                    href="/routes/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-lime-600 hover:bg-lime-700 text-white text-sm font-medium transition-colors"
                >
                    <PlusIcon className="w-4 h-4" />
                    Crear ruta
                </Link>
            </div>

            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <KpiCard label="Total rutas" value={stats.routes.total} icon={<MapIcon className="w-5 h-5" />} />
                    <KpiCard label="Nuevas este mes" value={stats.routes.newThisMonth} icon={<PlusCircleIcon className="w-5 h-5" />} />
                    <KpiCard label="Km registrados" value={stats.sessions.totalKm.toLocaleString()} icon={<BoltIcon className="w-5 h-5" />} />
                    <KpiCard label="Sesiones este mes" value={stats.sessions.thisMonth} icon={<CalendarDaysIcon className="w-5 h-5" />} />
                </div>
            )}

            <AdminRoutesFilters
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                onSortChange={handleSortChange}
            />

            {isLoading && <LoadingSpinner />}
            {isError && <p className="text-red-500 text-sm">Error al cargar rutas</p>}
            {!isLoading && !isError && data && (
                <AdminRoutesTable
                    routes={data.routes}
                    total={data.routesCount}
                    page={page}
                    limit={LIMIT}
                    onPageChange={setPage}
                    onDelete={setRouteToDelete}
                    isDeleting={deleteRoute.isPending}
                />
            )}

            <ConfirmModal
                isOpen={!!routeToDelete}
                title="¿Desactivar ruta?"
                message="Esta acción desactivará la ruta. Puede reactivarse más adelante."
                confirmLabel="Desactivar"
                cancelLabel="Cancelar"
                variant="warning"
                onConfirm={() => {
                    if (routeToDelete) deleteRoute.mutate(routeToDelete);
                    setRouteToDelete(null);
                }}
                onCancel={() => setRouteToDelete(null)}
            />
        </div>
    );
}
