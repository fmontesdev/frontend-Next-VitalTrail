'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import CategoryCard from './components/CategoryCard';
import { ICategoryRoutes } from '@/shared/interfaces/entities/categoryRoute.interface';

// Posicionamiento explícito en la rejilla de 4 columnas × 3 filas para pantallas lg:
//   explorar    → columnas 1-2, filas 1-2  (cuadrado grande 2×2)
//   desconectar → columnas 3-4, fila 1     (rectángulo horizontal)
//   activar     → columnas 3-4, fila 2     (rectángulo horizontal)
//   recuperar   → columna 1,    fila 3     (cuadrado pequeño)
//   consolidar  → columnas 2-3, fila 3     (rectángulo horizontal)
//   socializar  → columna 4,    fila 3     (cuadrado pequeño)
const GRID_LAYOUT_CLASSES: string[] = [
    'lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2',
    'lg:col-start-3 lg:col-span-2 lg:row-start-1 lg:row-span-1',
    'lg:col-start-3 lg:col-span-2 lg:row-start-2 lg:row-span-1',
    'lg:col-start-1 lg:col-span-1 lg:row-start-3 lg:row-span-1',
    'lg:col-start-2 lg:col-span-2 lg:row-start-3 lg:row-span-1',
    'lg:col-start-4 lg:col-span-1 lg:row-start-3 lg:row-span-1',
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const CategoryGrid: React.FC<ICategoryRoutes> = ({ categories }) => {
    const reducedMotion = useReducedMotion();

    return (
        <section>
            {/* Título con el mismo estilo que el resto de secciones del home */}
            <h2 className="text-2xl md:text-3xl font-bold text-teal-700 mb-1">
                Así te sientes, así eliges
            </h2>
            <p className="text-gray-500 mb-5">Elige la actividad que mejor se adapta a tu estado</p>

            <motion.div
                variants={containerVariants}
                initial={reducedMotion ? 'visible' : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="
                    grid grid-cols-2 gap-3
                    lg:grid-cols-4 lg:grid-rows-[220px_220px_200px] lg:gap-4
                "
            >
                {categories.map((category, index) => (
                    <CategoryCard
                        key={category.idCategory}
                        category={category}
                        priority={index < 2}
                        index={index}
                        layoutClass={GRID_LAYOUT_CLASSES[index] ?? ''}
                    />
                ))}
            </motion.div>
        </section>
    );
};

export default CategoryGrid;
