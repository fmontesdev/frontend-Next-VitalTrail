import apiService from "./apiService";
import { ICategoryRoute } from "@/shared/interfaces/entities/categoryRoute.interface";

export const CategoryRouteService = {
    getAllCategory(): Promise<ICategoryRoute[]> {
        return apiService.get<{categories: ICategoryRoute[]}>("/routes/categories").then((data) => {
            return data.categories;
        });
    }, 
};