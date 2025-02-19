import apiService from "./apiService";
import { IRoute } from "@/shared/interfaces/entities/route.interface";

export const FavoriteService = {
    favoriteRoute(slug: string): Promise<IRoute> {
        return apiService.post<{ route: IRoute }>(`/routes/${slug}/favorite`).then((data) => {
            return data.route;
        });
    },

    unfavoriteRoute(slug: string): Promise<IRoute> {
        return apiService.delete<{ route: IRoute }>(`/routes/${slug}/unfavorite`).then((data) => {
            return data.route;
        });
    },
    
};