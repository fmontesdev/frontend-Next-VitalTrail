'use client';

import { useState, useEffect } from 'react';

/**
 * Detecta si el dispositivo usa puntero táctil (móvil/tablet).
 * Usa matchMedia 'pointer: coarse' — más fiable que el ancho de pantalla.
 * Devuelve false en SSR para evitar hydration mismatch.
 */
export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const mq = window.matchMedia('(pointer: coarse)');
        setIsMobile(mq.matches);

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isMobile;
}
