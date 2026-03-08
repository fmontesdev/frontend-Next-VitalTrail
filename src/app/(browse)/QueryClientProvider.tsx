'use client'

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createQueryClient } from '@/libs/queryClientConfig';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { IQueryClientProviderProps } from '@/shared/interfaces/props/props.interface';

export function QueryCliProvider({ children }: IQueryClientProviderProps) {
    // useState con factory garantiza que cada árbol de React (SSR request o carga de browser)
    // reciba su propia instancia aislada, evitando que la caché SSR de una request
    // contamine la siguiente y cause hydration mismatch.
    const [queryClient] = useState(createQueryClient);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
