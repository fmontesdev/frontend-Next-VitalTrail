'use client';

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/queries/profileQuery";

/**
 * Hook que retorna true si el usuario actual es administrador
 */
export const useIsAdmin = (): boolean | null => {
    const { currentUser } = useAuth();
    if (currentUser.isLoading) return null;
    return currentUser.user?.rol === 'ROLE_ADMIN';
};

/**
 * Hook que retorna true si el usuario actual es cliente
 */
export const useIsClient = (): boolean | null=> {
    const { currentUser } = useAuth();
    if (currentUser.isLoading) return null;
    return currentUser.user?.rol === 'ROLE_CLIENT';
};

/**
 * Hook que retorna true si el usuario actual es el propietario del recurso
 * @param resourceAuthor - El username del autor del recurso
 */
export const useIsAuthor = (resourceAuthor: string): boolean => {
    const { currentUser } = useAuth();
    return currentUser.user?.username === resourceAuthor;
};

/**
 * Hook para determinar si el usuario puede gestionar un recurso
 * El usuario puede gestionar el recurso si es el propietario o si es administrador
 * 
 * @param resourceAuthor - El username del autor del recurso
 */
export function useCanManage(resourceAuthor: string): boolean {
    const { currentUser } = useAuth();
    return currentUser.user?.username === resourceAuthor || currentUser.user?.rol === 'ROLE_ADMIN';
}

/**
 * Hook para determinar si el admin tine acceso a recursos
 * Retorna un objeto { useCanManageAdmin, isLoading }
 *
 * @param profileUsername - El username del perfil visitado
 */
export function useCanManageAdmin(profileUsername: string) {
    const { currentUser } = useAuth();
    const { data: profile, isLoading } = useProfile(profileUsername);

    const canManageAdmin =
        (!isLoading &&
        !!profile &&
        currentUser.user?.rol !== 'ROLE_ADMIN') ||
        currentUser.user?.username !== profile?.username;

    return { canManageAdmin, isLoading };
}

/**
 * Hook para determinar si el usuario puede editar un perfil
 * Retorna un objeto { canEdit, isLoading }
 *
 * @param profileUsername - El username del perfil a editar
 */
export const useCanEdit = (profileUsername: string) => {
    const { currentUser } = useAuth();
    const { data: profile, isLoading } = useProfile(profileUsername);

    const canEdit =
        (!isLoading &&
        !!profile &&
        currentUser.isAuthenticated &&
        currentUser.user?.username === profile?.username) ||
        currentUser.user?.rol === 'ROLE_ADMIN';

    return { canEdit, isLoading };
};

/**
 * Hook para determinar si el usuario puede seguir a otro perfil
 * Retorna un objeto { canFollow, isLoading }
 *
 * @param profileUsername - El username del perfil que se evaluará para seguir
 */
export const useCanFollow = (profileUsername: string) => {
    const { currentUser } = useAuth();
    const { data: profile, isLoading } = useProfile(profileUsername);

    const canFollow =
        !isLoading &&
        !!profile &&
        currentUser.isAuthenticated &&
        currentUser.user?.username !== profile?.username;
    
    return { canFollow, isLoading };
};
