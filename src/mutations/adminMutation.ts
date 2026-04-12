'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminService } from '@/services/adminService';
import { RouteService } from '@/services/routeService';

export const useDeactivateAdminUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => AdminService.deactivateUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
};

export const useDeleteAdminRoute = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (slug: string) => RouteService.deleteRoute(slug),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['filteredRoutes'] });
            queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
        },
    });
};
