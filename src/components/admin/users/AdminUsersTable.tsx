'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UsersIcon } from '@heroicons/react/24/outline';
import { IAdminUser } from '@/shared/interfaces/entities/adminUser.interface';
import { getImageUrl } from '@/shared/utils/imageUrl';
import AdminTablePaginator from '@/components/admin/common/AdminTablePaginator';

interface IAdminUsersTableProps {
    users: IAdminUser[];
    total: number;
    page: number;
    limit: number;
    onPageChange: (p: number) => void;
    onDeactivate: (id: string) => void;
    isDeactivating: boolean;
}

export default function AdminUsersTable({
    users,
    total,
    page,
    limit,
    onPageChange,
    onDeactivate,
    isDeactivating,
}: IAdminUsersTableProps) {
    const totalPages = Math.ceil(total / limit);
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-teal-50 text-teal-700 uppercase text-xs border-b border-teal-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Usuario</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Rol</th>
                            <th className="px-4 py-3 text-left">Premium</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-left">Registrado</th>
                            <th className="px-4 py-3 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {users.map(user => (
                            <tr key={user.idUser} className="hover:bg-stone-50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={getImageUrl('avatar', user.imgUser)}
                                            alt={user.username}
                                            width={32}
                                            height={32}
                                            className="rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-800">{user.username}</p>
                                            <p className="text-xs text-gray-400">{user.name} {user.surname}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                        user.rol === 'ROLE_ADMIN'
                                            ? 'bg-teal-100 text-teal-700'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {user.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Cliente'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {user.isPremium && (
                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-700">
                                            Premium
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {user.isDeleted
                                        ? <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Eliminado</span>
                                        : user.isActive
                                            ? <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-lime-100 text-lime-700">Activo</span>
                                            : <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">Inactivo</span>
                                    }
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString('es-ES')}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/profile/${user.username}`}
                                            className="px-3 py-1 rounded-full text-xs font-medium border border-teal-300 text-teal-600 hover:bg-teal-50 transition-colors"
                                        >
                                            Ver perfil
                                        </Link>
                                        <button
                                            onClick={() => onDeactivate(user.idUser)}
                                            disabled={isDeactivating}
                                            className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Desactivar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-3 text-stone-400">
                                        <UsersIcon className="w-10 h-10" />
                                        <span className="text-sm font-medium">No se encontraron usuarios</span>
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
                entityLabel="usuarios"
                prevDisabled={page <= 1}
                nextDisabled={page >= totalPages}
                onPrev={() => onPageChange(page - 1)}
                onNext={() => onPageChange(page + 1)}
            />
        </div>
    );
}
