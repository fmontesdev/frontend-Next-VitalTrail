import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/userService';
import { SetTokenCookie, RemoveTokenCookie } from '@/auth/clientCookies';
import { useRouter } from 'next/navigation';
import { IUser, ILogin, IUserLogin, IRegister } from "@/shared/interfaces/entities/user.interface";
import { AxiosError } from 'axios';

const key = 'auth'

export const useRegisterMutation = () => {
    const router = useRouter();

    return useMutation<IUser, AxiosError, IRegister>({
        mutationFn: ( data: IRegister ) => UserService.register(data),
        retry: false, // No reintentar en caso de error
        onSuccess: () => {
            router.replace("/login");
        },
        onError: (error) => {
            console.log(error);
            // toast.error(err.response?.data?.message ?? 'No se pudo registrar');
        }
    });
};

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<IUserLogin, AxiosError, ILogin>({
        mutationFn: ( data: ILogin ) => UserService.login(data),
        retry: false, // No reintentar en caso de error
        onSuccess: async (loginUser: IUserLogin) => {
            queryClient.setQueryData([key], {
                user: loginUser,
                isAuthenticated: true
            });

            // Invalida las queries relacionadas con rutas para que las listas/tarjetas
            // se vuelvan a obtener con los estados actualizados del usuario autenticado
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['filteredRoutes'] }),
                queryClient.invalidateQueries({ queryKey: ['routes'] }),
                queryClient.invalidateQueries({ queryKey: ['route'] }),
            ]);

            // Establecer cookies de autenticación (idealmente en servidor con httpOnly)
            SetTokenCookie('token', loginUser.token, 1);
            SetTokenCookie('refreshToken', loginUser.refreshToken, 7);

            // Redirigir hacia el listado de rutas. Replace evita volver atrás al login con el botón del navegador
            router.replace("/routes");
            
            // logger.info("Login successful", data.user);
        },
        onError: (error) => {
            // logger.error("Login error", error);
            console.log(error);
            // toast.error(err.response?.data?.message ?? 'Error al iniciar sesión');
        }
    });
};

export const useRefreshTokenMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<string, AxiosError, string>({
        mutationFn: ( refreshToken: string ) => UserService.refreshToken(refreshToken),
        retry: false, // No reintentar en caso de error
        onSuccess: (newToken: string) => {
            queryClient.setQueryData([key], (prev: { user: IUserLogin | null; isAuthenticated: boolean } | undefined) => {
                if (!prev?.user) {
                    // si no hay user cacheado, no intentes inventar uno
                    return prev ?? { user: null, isAuthenticated: false };
                }
                    // opcional: actualiza el token dentro del user
                    return {
                        ...prev,
                        user: { ...prev.user, token: newToken },
                };
            });

            // Establecer cookies de autenticación
            SetTokenCookie('token', newToken, 1);
            
            // logger.info("Renew accessToken successful", data.user);
        },
        onError: (error) => {
            // logger.error("Login error", error);
            console.log(error);
            // Posible acción: forzar logout si refresh falla con 401/403
        }
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation<string, AxiosError, string>({
        mutationFn: (refreshToken : string ) => UserService.logout({ refresh_token: refreshToken }),
        retry: false, // No reintentar en caso de error
        onSuccess: async () => {
            queryClient.setQueryData([key], { user: null, isAuthenticated: false, isPremium: false });

            // Invalida las queries relacionadas con rutas/favoritos para que las listas/tarjetas
            // se vuelvan a obtener con el estado de favoritos del usuario autenticado
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['filteredRoutes'] }),
                queryClient.invalidateQueries({ queryKey: ['routes'] }),
                queryClient.invalidateQueries({ queryKey: ['route'] }),
            ]);

            // Eliminar cookies de autenticación
            RemoveTokenCookie('token');
            RemoveTokenCookie('refreshToken');

            // Redirigir hacia el home
            router.replace('/');

            // logger.info("Logout successful");
        },
        onError: (error) => {
            // logger.error("Login error", error);
            console.log(error);
            // toast.error('No se pudo cerrar sesión');
        }
    });
};
