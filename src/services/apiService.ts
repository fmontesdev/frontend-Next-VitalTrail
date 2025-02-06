const BASE_URL = process.env.SYMFONY_API_URL || 'http://localhost:8000/api'
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Crear una instancia de Axios con configuración base
export const axiosApi: AxiosInstance = axios.create({
    baseURL: BASE_URL,
});

// Agregar un interceptor de solicitud
axiosApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const apiService = {

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await axiosApi.get<T>(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await axiosApi.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await axiosApi.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    async update<T>(url: string, slug: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await axiosApi.put<T>(`${url}/${slug}`, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await axiosApi.delete<T>(url, config);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    handleError(error: any): never {
        throw new Error(error?.response?.data?.message || error.message || "An error occurred");
    },
};

export default apiService;
