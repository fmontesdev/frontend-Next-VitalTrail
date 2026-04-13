import apiService from "./apiService";
import { IUser, ILogin, IUserLogin, IRegister, IUpdProfile } from "@/shared/interfaces/entities/user.interface";

export const UserService = {
    getCurrentUser(): Promise<IUser> {
        return apiService.get<{user: IUser}>(`/user`).then((currentUser) => {
            return currentUser.user;
        });
    },

    login(data: ILogin): Promise<IUserLogin> {
        return apiService.post<{user: IUserLogin}>(`/users/login`, data).then((loginUser) => {
            return loginUser.user;
        });
    },

    register(data: IRegister): Promise<IUser> {
        const defaultAvatars = [
            'avatar-default-m1.png', 'avatar-default-m2.png', 'avatar-default-m3.png',
            'avatar-default-m4.png', 'avatar-default-m5.png', 'avatar-default-m6.png',
            'avatar-default-m7.png', 'avatar-default-m8.png', 'avatar-default-m9.png',
            'avatar-default-f1.png', 'avatar-default-f2.png', 'avatar-default-f3.png',
            'avatar-default-f4.png', 'avatar-default-f5.png', 'avatar-default-f6.png',
            'avatar-default-f7.png', 'avatar-default-f8.png', 'avatar-default-f9.png',
        ];
        const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
        const payload: IRegister = {
            user: {
                ...data.user,
                imgUser: data.user.imgUser || randomAvatar,
                rol: data.user.rol || 'ROLE_CLIENT',
                client: data.user.client ?? { phone: null },
            }
        };
        return apiService.post<{user: IUser}>(`/users/register`, payload).then((registerUser) => {
            return registerUser.user;
        });
    },

    updateUser(data: IUpdProfile): Promise<IUser> {
        return apiService.put<IUser>(`/user`, data ).then((updProfile) => {
            return updProfile;
        });
    },

    refreshToken(refreshToken: string): Promise<string> {
        return apiService.post<{token: string}>(`/token/refresh`, refreshToken).then((token) => {
            console.log(token);
            return token.token;
        });
    },

    logout(data: { refresh_token: string }): Promise<string> {
        return apiService.post<{message: string}>(`/token/invalidate`, data).then((response) => {
            return response.message;
        });

    },
};
