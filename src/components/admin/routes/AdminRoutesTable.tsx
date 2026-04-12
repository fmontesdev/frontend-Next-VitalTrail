'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapIcon } from '@heroicons/react/24/outline';
import { IRoute } from '@/shared/interfaces/entities/route.interface';
import { IUser } from '@/shared/interfaces/entities/user.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';
import AdminTablePaginator from '@/components/admin/common/AdminTablePaginator';

interface IAdminRoutesTableProps {
    routes: IRoute[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (p: number) => void;
    onDelete: (slug: string) => void;
    isDeleting: boolean;
}

const DIFFICULTY_BADGE: Record<string, string> = {
    'fácil': 'bg-green-100 text-green-700',
    'moderada': 'bg-yellow-100 text-yellow-700',
    'difícil': 'bg-orange-100 text-orange-700',
    'experto': 'bg-red-100 text-red-700',
};

function getUsername(user: IUser | string | undefined): string {
    if (!user) return '—';
    if (typeof user === 'string') return user;
    return user.username;
}

export default function AdminRoutesTable({
    routes,
    total,
    page,
    limit,
    onPageChange,
    onDelete,
    isDeleting,
}: IAdminRoutesTableProps) {
    const totalPages = Math.ceil(total / limit);
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-teal-50 text-teal-700 uppercase text-xs border-b border-teal-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Ruta</th>
                            <th className="px-4 py-3 text-left">Autor</th>
                            <th className="px-4 py-3 text-left">Categoría</th>
                            <th className="px-4 py-3 text-left">Distancia</th>
                            <th className="px-4 py-3 text-left">Dificultad</th>
                            <th className="px-4 py-3 text-left">Creado</th>
                            <th className="px-4 py-3 text-left">Favoritos</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {routes.map(route => {
                            const firstImage = route.images?.[0]?.imgRoute;
                            const username = getUsername(route.user);
                            return (
                                <tr key={route.idRoute} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {firstImage ? (
                                                <Image
                                                    src={getImageUrl('route', firstImage)}
                                                    alt={route.title}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                    <MapIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-800">{route.title}</p>
                                                <p className="text-xs text-gray-400">{route.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {username !== '—' ? (
                                            <Link
                                                href={`/profile/${username}`}
                                                className="text-teal-600 hover:underline"
                                            >
                                                {username}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700">
                                            {route.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {(route.distance / 1000).toFixed(1)} km
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                            DIFFICULTY_BADGE[route.difficulty] ?? 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {route.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(route.createdAt).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{route.favoritesCount}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/route/${route.slug}`}
                                                className="px-3 py-1 rounded-full text-xs font-medium border border-teal-300 text-teal-600 hover:bg-teal-50 transition-colors"
                                            >
                                                Ver
                                            </Link>
                                            <button
                                                onClick={() => onDelete(route.slug)}
                                                disabled={isDeleting}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                Desactivar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {routes.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3 text-stone-400">
                                        <MapIcon className="w-10 h-10" />
                                        <span className="text-sm font-medium">No se encontraron rutas</span>
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
                entityLabel="rutas"
                prevDisabled={page <= 1}
                nextDisabled={page >= totalPages}
                onPrev={() => onPageChange(page - 1)}
                onNext={() => onPageChange(page + 1)}
            />
        </div>
    );
}
