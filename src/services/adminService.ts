import apiService from './apiService';
import { IAdminStats, IUserGrowthPoint, IRouteGrowthPoint } from '@/shared/interfaces/entities/adminStats.interface';
import { IAdminUsersPage } from '@/shared/interfaces/entities/adminUser.interface';

/**
 * Admin service — Symfony API.
 * Pagination convention: 1-based (page=1 is the first page).
 * This matches the Symfony backend contract; do not change to 0-based.
 */
export const AdminService = {
    getStats(): Promise<IAdminStats> {
        return apiService.get<IAdminStats>('/admin/stats');
    },

    getUsersGrowth(): Promise<IUserGrowthPoint[]> {
        return apiService.get<IUserGrowthPoint[]>('/admin/stats/users-growth');
    },

    getRoutesGrowth(): Promise<IRouteGrowthPoint[]> {
        return apiService.get<IRouteGrowthPoint[]>('/admin/stats/routes-growth');
    },

    getUsers(page: number, limit: number, search?: string, role?: string, isPremium?: boolean, isActive?: boolean): Promise<IAdminUsersPage> {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('limit', String(limit));
        if (search) params.set('search', search);
        if (role) params.set('role', role);
        if (isPremium !== undefined) params.set('isPremium', String(isPremium));
        if (isActive !== undefined) params.set('isActive', String(isActive));
        return apiService.get<IAdminUsersPage>(`/admin/users?${params.toString()}`);
    },

    deactivateUser(id: string): Promise<void> {
        return apiService.delete<void>(`/admin/users/${id}`);
    },
};
