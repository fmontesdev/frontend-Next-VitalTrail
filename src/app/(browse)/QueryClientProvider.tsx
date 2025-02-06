'use client'

import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/queries/queryClient';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { IQueryClientProviderProps } from '@/shared/interfaces/props/props.interface';

export function QueryCliProvider({ children }: IQueryClientProviderProps) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
