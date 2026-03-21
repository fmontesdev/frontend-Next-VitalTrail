import apiService from "./apiService";
import { IRoute, IRoutes, ICreateRoute } from "@/shared/interfaces/entities/route.interface";
import { IImagesRoute } from "@/shared/interfaces/entities/imageRoute.interface";
import { IFilter } from "@/shared/interfaces/filters/filters.interface";

export const RouteService = {
    getAll(): Promise<IRoutes> {
        return apiService.get<IRoutes>("routes");
    },

    getFiltered(filters: IFilter): Promise<IRoutes> {
        const queryParams = new URLSearchParams(
            Object.entries(filters).filter(([, v]) => v !== undefined) as [string, string][]
        ).toString();
        return apiService.get<IRoutes>(`/routes?${queryParams}`);
    },

    getTrending(): Promise<IRoute[]> {
        return apiService.get<IRoutes>('/routes?sortBy=favoritesCount&order=desc&limit=8')
            .then((data) => data.routes);
    },

    getById(id: string): Promise<IRoute> {
        return apiService.get<{route: IRoute}>(`/routes/${id}`).then((data) => data.route);
    },
    
    getBySlug(slug: string): Promise<IRoute> {
        return apiService.get<{route: IRoute}>(`/routes/${slug}`).then((data) => data.route);
    },

    createRoute(data: ICreateRoute): Promise<IRoute> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { images: _images, ...routeData } = data;
        const payload = {
            ...routeData,
            // Leaflet trabaja con tuplas [lat, lng]; Symfony espera objetos {lat, lng}
            coordinates: routeData.coordinates.map(([lat, lng]) => ({ lat, lng })),
        };
        return apiService.post<{ route: IRoute }>('/routes', { route: payload }).then((r) => r.route);
    },

    updateRoute(slug: string, data: Partial<IRoute>): Promise<IRoute> {
        return apiService.put<IRoute>(`/routes/${slug}`, data );
    },

    deleteRoute(slug: string): Promise<IRoute> {
        return apiService.delete<IRoute>(`/routes/${slug}`);
    },

    uploadImage(idRoute: number, file: File): Promise<IImagesRoute> {
        const formData = new FormData();
        formData.append('file', file);
        return apiService.post<IImagesRoute>(
            `/routes/${idRoute}/images/upload`,
            formData,
            false,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
    },
    
};