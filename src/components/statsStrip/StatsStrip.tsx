'use client'

import { useRef, useEffect } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { useHomeStats } from '@/queries/statQuery';
import { floorToSignificant } from '@/shared/utils/floorToSignificant';
import { IHomeStats } from '@/shared/interfaces/entities/stat.interface';

interface IStatItem {
    value: number;
    label: string;
    suffix: string;
}

// Valores de respaldo mientras se carga o si la petición falla
const FALLBACK_STATS: IStatItem[] = [
    { value: 500,   label: 'Rutas disponibles',     suffix: '+' },
    { value: 12,    label: 'Categorías',             suffix: '' },
    { value: 8500,  label: 'Exploradores activos',   suffix: '+' },
    { value: 45000, label: 'Kilómetros registrados', suffix: '+' },
];

// Mapea la respuesta del backend al formato de items de estadísticas
function mapStatsToItems(data: IHomeStats): IStatItem[] {
    return [
        { value: floorToSignificant(data.totalRoutes),      label: 'Rutas disponibles',     suffix: '+' },
        { value: floorToSignificant(data.totalCategories),  label: 'Categorías',             suffix: '' },
        { value: floorToSignificant(data.totalActiveUsers), label: 'Exploradores activos',   suffix: '+' },
        { value: floorToSignificant(data.totalKm/1000),     label: 'Kilómetros registrados', suffix: '+' },
    ];
}

interface IStatCounterProps {
    value: number;
    suffix: string;
    inView: boolean;
}

const StatCounter: React.FC<IStatCounterProps> = ({ value, suffix, inView }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        if (!inView || nodeRef.current === null) return;

        if (prefersReducedMotion) {
            nodeRef.current.textContent = value.toLocaleString('es-ES') + suffix;
            return;
        }

        const controls = animate(0, value, {
            duration: 2,
            ease: 'easeOut',
            onUpdate: (v) => {
                if (nodeRef.current !== null) {
                    nodeRef.current.textContent = Math.round(v).toLocaleString('es-ES') + suffix;
                }
            },
        });

        return () => controls.stop();
    }, [inView, value, suffix, prefersReducedMotion]);

    return (
        <span
            ref={nodeRef}
            className="text-4xl font-bold"
            aria-label={value.toLocaleString('es-ES') + suffix}
        >
            0
        </span>
    );
};

const StatsStrip: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const inView = useInView(sectionRef, { once: true });
    const { data, isLoading } = useHomeStats();

    // Usar datos reales si están disponibles, si no el fallback hardcoded
    const stats = !isLoading && data ? mapStatsToItems(data) : FALLBACK_STATS;

    return (
        <section
            ref={sectionRef}
            aria-label="Estadísticas de VitalTrail"
            className="w-full bg-gradient-to-r from-lime-600 to-teal-600 py-3.5"
        >
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <StatCounter value={stat.value} suffix={stat.suffix} inView={inView} />
                        <p className="text-sm font-medium opacity-80 mt-0.5 mb-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default StatsStrip;
