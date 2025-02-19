import apiService from "./apiService";
import { IProfile, IProfiles } from "@/shared/interfaces/entities/user.interface";

export const ProfileService = {
    getProfile(username: string): Promise<IProfile> {
        return apiService.get<{profile: IProfile}>(`/profiles/${username}`).then((response) => {
            return response.profile;
        });
    },

    getFollowings(username: string): Promise<IProfiles> {
        return apiService.get<IProfiles>(`/profiles/${username}/followings`);
    },

    getFollowers(username: string): Promise<IProfiles> {
        return apiService.get<IProfiles>(`/profiles/${username}/followers`);
    },

    follow(username: string): Promise<IProfile> {
        return apiService.put<{profile: IProfile}>(`/profiles/${username}/follow`).then((response) => {
            return response.profile;
        });
    },

    unfollow(username: string): Promise<IProfile> {
        return apiService.delete<{profile: IProfile}>(`/profiles/${username}/unfollow`).then((response) => {
            return response.profile;
        });
    },
};
