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
        return apiService.post<{user: IUser}>(`/users/register`, data).then((registerUser) => {
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
