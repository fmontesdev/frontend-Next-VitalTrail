"use client";

import { useAuthQuery } from "@/queries/authQuery";
import { useRegisterMutation, useLoginMutation, useRefreshTokenMutation, useLogoutMutation } from "@/mutations/authMutation";

export function useAuth() {
    const { data: authData, isLoading, isError } = useAuthQuery();
    const registerMutation = useRegisterMutation();
    const loginMutation = useLoginMutation();
    const refreshTokenMutation = useRefreshTokenMutation();
    const logoutMutation = useLogoutMutation();

    return {
        currentUser: {
            user: authData?.user || null,
            isAuthenticated: authData?.isAuthenticated || false,
            isLoading,
            isError,
        },
        register: {
            mutateAsync: registerMutation.mutateAsync,
            isPending: registerMutation.isPending,
            isError: registerMutation.isError,
        },
        login: {
            mutateAsync: loginMutation.mutateAsync,
            isPending: loginMutation.isPending,
            isError: loginMutation.isError,
        },
        refreshToken: {
            mutateAsync: refreshTokenMutation.mutateAsync,
            isPending: refreshTokenMutation.isPending,
            isError: refreshTokenMutation.isError,
        },
        logout: {
            mutateAsync: logoutMutation.mutateAsync,
            isPending: logoutMutation.isPending,
            isError: logoutMutation.isError,
        },
    };
}