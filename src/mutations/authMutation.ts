import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '@/services/userService';
import { SetTokenCookie, RemoveTokenCookie } from '@/auth/clientCookies';
import { useRouter } from 'next/navigation';
import { IUser, ILogin, IUserLogin, IRegister } from "@/shared/interfaces/entities/user.interface";

const key = 'auth'

export const useRegisterMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ( data: IRegister ) => UserService.register(data),
        onSuccess: (registerUser: IUser) => {
            // console.log('Register: ', registerUser);

            // Redirigir hacia el login
            router.push("/login");
        },
        onError: (error) => {
            console.log(error);
        }
    });
};

export const useLoginMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: ( data: ILogin ) => UserService.login(data),
        onSuccess: (loginUser: IUserLogin) => {
            queryClient.setQueryData([key], { user: loginUser, isAuthenticated: true });
            queryClient.invalidateQueries({ queryKey: [key] });

            // Establecer cookies de autenticación
            SetTokenCookie('token', loginUser.token, 1);
            SetTokenCookie('refreshToken', loginUser.refreshToken, 7);

            // Redirigir hacia el listado de rutas
            router.push("/routes");
            
            // logger.info("Login successful", data.user);
        },
        onError: (error) => {
            // logger.error("Login error", error);
            console.log(error);
        }
    });
};

export const useRefreshTokenMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ( refreshToken: string ) => UserService.refreshToken(refreshToken),
        onSuccess: (token: string) => {
            queryClient.setQueryData([key], token);
            queryClient.invalidateQueries({ queryKey: [key] });

            // Establecer cookies de autenticación
            SetTokenCookie('token', token, 1);
            // SetTokenCookie('refreshToken', loginUser.refreshToken, 7);
            
            // logger.info("Login successful", data.user);
        },
        onError: (error) => {
            // logger.error("Login error", error);
            console.log(error);
        }
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (refreshToken : string ) => UserService.logout({ refresh_token: refreshToken }),
        onSuccess: () => {
            queryClient.setQueryData([key], { user: null, isAuthenticated: false });
            queryClient.invalidateQueries({ queryKey: [key] });

            // Eliminar cookies de autenticación
            RemoveTokenCookie('token');
            RemoveTokenCookie('refreshToken');

            // Redirigir hacia el home
            router.push('/');

            // logger.info("Login successful", data.user);
        },
        onError: (error) => {
            // logger.error("Login error", error);
            console.log(error);
        }
    });
};
