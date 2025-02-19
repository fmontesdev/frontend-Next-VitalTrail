import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/userService';
import { IUser } from "@/shared/interfaces/entities/user.interface";

const key = 'auth'

export const useAuthQuery = () => {
    return useQuery({
        queryKey: [key],
        queryFn: async (): Promise<{user: IUser | null, isAuthenticated: boolean}> => {
            try {
                const user = await UserService.getCurrentUser();
                // console.log('Usuario registrado: ', user);
                return user ? { user: user, isAuthenticated: true } : { user: null, isAuthenticated: false };
            } catch (error: any) {
                if (error.response && error.response.data.code === 401) {
                    return { user: null, isAuthenticated: false };
                }
            }
            return { user: null, isAuthenticated: false };
        },
        staleTime: 1000 * 120, // 2 minutos
    });
}
