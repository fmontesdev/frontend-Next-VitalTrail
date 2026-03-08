import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { GetTokenCookie } from "@/auth/clientCookies";

// URLs públicas (browser - cliente) y privadas (SSR - servidor)
const SYMFONY_URL_PUBLIC = process.env.NEXT_PUBLIC_SYMFONY_API_URL || 'http://localhost:8000/api'
const SYMFONY_URL_INTERNAL = process.env.INTERNAL_SYMFONY_API_URL || 'http://symfony:8000/api'

const SPRINGBOOT_URL_PUBLIC = process.env.NEXT_PUBLIC_SPRINGBOOT_API_URL || 'http://localhost:8080'
const SPRINGBOOT_URL_INTERNAL = process.env.INTERNAL_SPRINGBOOT_API_URL || 'http://springboot:8080'

// Singletons perezosos por entorno (evita fijar baseURL en el import)
let symfonyBrowser: AxiosInstance | null = null;
let symfonyServer: AxiosInstance | null = null;
let springBrowser: AxiosInstance | null = null;
let springServer: AxiosInstance | null = null;

const isBrowser = () => typeof window !== 'undefined';
// Interceptor solo en cliente (acceso a cookies)
const interceptor = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    if (isBrowser()) {
        const token = GetTokenCookie('token');
        if (token) {
            // Aseguramos headers
            config.headers = config.headers ?? {};
            // Forzamos el campo Authorization (evita choques con el tipo AxiosRequestHeaders)
            (config.headers as any).Authorization = `Bearer ${token}`;
        }
    }
    return config;
};

// Instancias de Axios por entorno
function getSymfonyInstance(): AxiosInstance {
    if (isBrowser()) {
        if (!symfonyBrowser) {
            symfonyBrowser = axios.create({
                baseURL: SYMFONY_URL_PUBLIC,
                withCredentials: true, // Habilitar el envío de cookies
            });
            symfonyBrowser.interceptors.request.use(
                interceptor,
                (error) => Promise.reject(error)
            );
        }
        return symfonyBrowser;
    } else {
        if (!symfonyServer) {
            symfonyServer = axios.create({
                baseURL: SYMFONY_URL_INTERNAL,
                withCredentials: true, // Habilitar el envío de cookies
            });
            symfonyServer.interceptors.request.use(
                (config) => config,
                (error) => Promise.reject(error)
            );
        }
        return symfonyServer;
    }
}

function getSpringInstance(): AxiosInstance {
    if (isBrowser()) {
        if (!springBrowser) {
            springBrowser = axios.create({
                baseURL: SPRINGBOOT_URL_PUBLIC,
                withCredentials: true, // Habilitar el envío de cookies
            });
            springBrowser.interceptors.request.use(
                interceptor,
                (error) => Promise.reject(error)
            );
        }
        return springBrowser;
    } else {
        if (!springServer) {
            springServer = axios.create({
                baseURL: SPRINGBOOT_URL_INTERNAL,
                withCredentials: true, // Habilitar el envío de cookies
            });
            springServer.interceptors.request.use(
                (config) => config,
                (error) => Promise.reject(error)
            );
        }
        return springServer;
    }
}

const handleError = (error: any): never => {
    // throw new Error(error?.response?.data?.message || error.message || "An error occurred");
    throw error;
};

function getApiInstance(useSpringBoot: boolean): AxiosInstance {
    return useSpringBoot ? getSpringInstance() : getSymfonyInstance();
}

const apiService = {
    async get<T>(url: string, useSpringBoot: boolean = false, config?: AxiosRequestConfig): Promise<T> {
        try {
            const instance = getApiInstance(useSpringBoot);
            const response = await instance.get<T>(url, config);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    async post<T>(url: string, data?: any, useSpringBoot: boolean = false, config?: AxiosRequestConfig): Promise<T> {
        try {
            const instance = getApiInstance(useSpringBoot);
            const response = await instance.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    async put<T>(url: string, data?: any, useSpringBoot: boolean = false, config?: AxiosRequestConfig): Promise<T> {
        try {
            const instance = getApiInstance(useSpringBoot);
            const response = await instance.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    async update<T>(url: string, slug: string, data?: any, useSpringBoot: boolean = false, config?: AxiosRequestConfig): Promise<T> {
        try {
            const instance = getApiInstance(useSpringBoot);
            const response = await instance.put<T>(`${url}/${slug}`, data, config);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },

    async delete<T>(url: string, useSpringBoot: boolean = false, config?: AxiosRequestConfig): Promise<T> {
        try {
            const instance = getApiInstance(useSpringBoot);
            const response = await instance.delete<T>(url, config);
            return response.data;
        } catch (error) {
            return handleError(error);
        }
    },
};

export default apiService;
