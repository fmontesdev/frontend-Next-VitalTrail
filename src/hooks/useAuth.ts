"use client";

import { useAuthQuery } from "@/queries/authQuery";
import { useRegisterMutation, useLoginMutation, useRefreshTokenMutation, useLogoutMutation } from "@/mutations/authMutation";
import { useState, useEffect } from "react";

export function useAuth() {
    // Estado local para controlar la apariencia de carga
    const [showLoadingUI, setShowLoadingUI] = useState(true);

    const { data: authData, isLoading, isError, isFetching } = useAuthQuery();
    const registerMutation = useRegisterMutation();
    const loginMutation = useLoginMutation();
    const refreshTokenMutation = useRefreshTokenMutation();
    const logoutMutation = useLogoutMutation();

    // useEffect para controlar cuándo mostrar estados de carga
    useEffect(() => {
        // Si tenemos datos iniciales, no mostramos loading
        if (authData && !isFetching) {
            setShowLoadingUI(false);
        }
        
        // Si estamos en proceso de carga inicial, retrasamos un poco para evitar parpadeos
        if (isLoading) {
            const timer = setTimeout(() => {
                setShowLoadingUI(true);
            }, 0); // Pequeño retraso para evitar parpadeos en cargas rápidas
            
            return () => clearTimeout(timer);
        }
        
        // Si terminamos de cargar (éxito o error), escondemos el loading
        if (!isLoading) {
            setShowLoadingUI(false);
        }
    }, [isLoading, isFetching, authData]);

    return {
        currentUser: {
            user: authData?.user || null,
            isAuthenticated: authData?.isAuthenticated || false,
            isLoading: showLoadingUI,
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