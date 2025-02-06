import apiService from "./apiService";
import { IRoute, IRoutes } from "@/shared/interfaces/entities/route.interface";
import { IFilter } from "@/shared/interfaces/filters/filters.interface";

export const RouteService = {
    getAll(): Promise<IRoutes> {
        return apiService.get<IRoutes>("routes");
    },

    getFiltered(filters: IFilter): Promise<IRoutes> {
        const queryParams = new URLSearchParams(Object.entries(filters)).toString();
        return apiService.get<IRoutes>(`routes?${queryParams}`);
    },

    // getFiltered(filters: Filter): Promise<Routes> {
    //     const queryParams = new URLSearchParams(Object.entries(filters)).toString();
    //     return apiService.get<Routes>(`routes?${queryParams}`).then((data) => {
    //         console.log(filters, queryParams, data);
    //         return data;
    //     });
    // },

    getById(id:string): Promise<IRoute> {
        return apiService.get<IRoute>(`routes/${id}`);
    },
    
    getBySlug(slug: string): Promise<IRoute> {
        return apiService.get<IRoute>(`routes/${slug}`);
    },

    createRoute(data: Partial<IRoute>): Promise<IRoute> {
        
        return apiService.post<IRoute>('/routes', data);
    },

    updateRoute(slug: string, data: Partial<IRoute>): Promise<IRoute> {
        return apiService.put<IRoute>(`/routes/${slug}`, data );
    },

    deleteRoute(slug: string): Promise<IRoute> {
        return apiService.delete<IRoute>(`/routes/${slug}`);
    },
    
};