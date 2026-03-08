import { QueryClient } from '@tanstack/react-query';

/**
 * Factory function — devuelve una nueva instancia de QueryClient por llamada.
 * NO exportar un singleton: Next.js App Router comparte módulos entre requests SSR,
 * lo que provocaría que la caché de una request contaminase la siguiente y rompería
 * la hidratación React (server data != client data en el primer render).
 */
export function createQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,    // No volver a buscar datos cuando la ventana vuelve a foco
                refetchOnMount: true,           // Volver a buscar datos al montar el componente
                refetchOnReconnect: false,      // No volver a buscar datos al reconectar
                retry: 1,                       // Número de reintentos en caso de error
                // staleTime: 1000 * 60,        // Tiempo en ms que los datos se consideran "frescos"
            },
        },
    });
}
