'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ICategoryRoute } from '@/shared/interfaces/entities/categoryRoute.interface';

const CategoriesCarouselSlide: React.FC<{ category: ICategoryRoute }> = ({ category }) => {
    // Función para capitalizar la primera letra de un texto
    const capitalizeFirstLetter = (text: string) => 
        text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} // Comienza invisible y desplazado hacia abajo
            animate={{ opacity: 1, y: 0 }}  // Aparece suavemente
            transition={{ duration: 0.6, ease: "easeOut" }} // Duración de la animación
        >
            <Link href={`/routes?category=${category.title}`}>
                {/* Cada slide tendrá una altura fija de 300px */}
                <div className="
                    flex w-full h-[300px] rounded-2xl bg-lime-600/55
                    sm:bg-gradient-to-r from-lime-600/60 via-lime-600/60 to-white
                ">
                    {/* Área de la imagen (60% del ancho) */}
                    <div className="w-3/5 relative overflow-hidden rounded-l-2xl bg-stone-100">
                        <Image
                            src={`/categories_carousel/${category.imgCategory}`}
                            alt={category.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (min-width: 769px) 60vw"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-500 hover:scale-105"
                        />ICategoryRoutes
                    </div>
                    {/* Área del texto (40% del ancho) */}
                    <div className="w-2/5 flex flex-col justify-center px-6 py-2">
                        <h2 className="text-xl md:text-2xl font-black text-white">{capitalizeFirstLetter(category.title)}</h2>
                        <p className="mt-2 text-base md:text-lg font-medium text-stone-800 overflow-hidden text-ellipsis">
                            {category.description}
                        </p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CategoriesCarouselSlide;
