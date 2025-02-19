'use client';

import { useState, useEffect } from 'react';

export function useDistanceDelay<T>(value: T, delay = 300): T {
    const [delayValue, setDelayValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDelayValue(value);
        }, delay);

        // Limpia el timer si el valor cambia antes de que termine el delay
        return () => clearTimeout(timer);
    }, [value, delay]);

    return delayValue;
}