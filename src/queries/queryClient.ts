import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,    // No volver a buscar datos cuando la ventana vuelve a foco
            refetchOnMount: false,          // No volver a buscar datos al montar el componente
            retry: 1,                       // Número de reintentos en caso de error
            // staleTime: 1000 * 60,           // Tiempo en ms que los datos se consideran "frescos"
        },
    },
});

export default queryClient;
