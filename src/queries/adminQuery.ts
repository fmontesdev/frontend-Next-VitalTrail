'use client';

import { useQuery } from '@tanstack/react-query';
import { AdminService } from '@/services/adminService';

export const adminKeys = {
    stats: () => ['admin', 'stats'] as const,
    usersGrowth: () => ['admin', 'stats', 'users-growth'] as const,
    routesGrowth: () => ['admin', 'stats', 'routes-growth'] as const,
    users: (page: number, limit: number, search?: string, role?: string, isPremium?: boolean, isActive?: boolean) =>
        ['admin', 'users', { page, limit, search, role, isPremium, isActive }] as const,
};

export const useAdminStats = () => useQuery({
    queryKey: adminKeys.stats(),
    queryFn: AdminService.getStats,
    staleTime: 1000 * 60 * 5,
});

export const useAdminUsersGrowth = () => useQuery({
    queryKey: adminKeys.usersGrowth(),
    queryFn: AdminService.getUsersGrowth,
    staleTime: 1000 * 60 * 5,
});

export const useAdminRoutesGrowth = () => useQuery({
    queryKey: adminKeys.routesGrowth(),
    queryFn: AdminService.getRoutesGrowth,
    staleTime: 1000 * 60 * 5,
});

export const useAdminUsers = (page: number, limit: number, search?: string, role?: string, isPremium?: boolean, isActive?: boolean) =>
    useQuery({
        queryKey: adminKeys.users(page, limit, search, role, isPremium, isActive),
        queryFn: () => AdminService.getUsers(page, limit, search, role, isPremium, isActive),
        staleTime: 1000 * 30,
    });
