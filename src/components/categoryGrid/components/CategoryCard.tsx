'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ICategoryRoute } from '@/shared/interfaces/entities/categoryRoute.interface';

interface ICategoryCardProps {
    category: ICategoryRoute;
    priority?: boolean;
    index: number;
    layoutClass?: string;
}

// Variante de entrada: se coordina con el stagger del contenedor padre (CategoryGrid)
const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.45, ease: 'easeOut' },
    },
};

const CategoryCard: React.FC<ICategoryCardProps> = ({
    category,
    priority = false,
    index: _index,
    layoutClass = '',
}) => {
    const reducedMotion = useReducedMotion();
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const [isHovered, setIsHovered] = useState(false);

    // Efecto tilt 3D — solo en desktop y sin prefers-reduced-motion.
    // También activa isHovered como respaldo ante casos donde onMouseEnter no dispara
    // (puede ocurrir cuando Framer Motion procesa el pointer event antes que React).
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isHovered) setIsHovered(true);
        if (reducedMotion || typeof window === 'undefined' || window.innerWidth < 1024) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ rotateX: -y * 8, rotateY: x * 8 });
    };

    const handleMouseLeave = () => {
        setTilt({ rotateX: 0, rotateY: 0 });
        setIsHovered(false);
    };

    return (
        // motion.div exterior: recibe las variantes de stagger del contenedor padre
        <motion.div
            variants={cardVariants}
            className={`relative overflow-hidden rounded-3xl min-h-[160px] cursor-pointer ${layoutClass}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Enlace que cubre toda la tarjeta */}
            <Link
                href={`/routes?category=${category.title}`}
                className="absolute inset-0 z-10"
                aria-label={`Ver rutas de ${category.title}`}
            />

            {/* motion.div interior: gestiona el tilt 3D sin interferir con las variantes de stagger */}
            <motion.div
                className="absolute inset-0 overflow-hidden"
                animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ perspective: 1000, transformStyle: 'preserve-3d' as const }}
            >
                {/* Imagen: zoom suave en hover */}
                <Image
                    src={`/categories_carousel/${category.imgCategory}`}
                    alt={category.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-700 ease-out ${
                        isHovered ? 'scale-105' : 'scale-100'
                    }`}
                    priority={priority}
                />
            </motion.div>

            {/* Gradiente permanente en la parte superior — da legibilidad al título */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent z-20 pointer-events-none" />

            {/* Título — esquina superior izquierda, blanco por defecto, lima en hover */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 pointer-events-none">
                <h3 className="text-lg font-bold capitalize leading-tight text-white">
                    {category.title}
                </h3>
            </div>

            {/* Panel de descripción — se desliza hacia arriba desde el borde inferior en hover */}
            <div className={`absolute bottom-0 left-0 right-0 z-20 pointer-events-none transition-transform duration-300 ease-out ${
                isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className="bg-gradient-to-t from-black/75 via-black/45 to-transparent px-4 pb-4 pt-10">
                    <p className="text-sm font-semibold text-lime-400 line-clamp-3 leading-relaxed">
                        {category.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryCard;
