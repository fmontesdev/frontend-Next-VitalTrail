'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ICategoryCarouselSlideProps } from '@/shared/interfaces/props/props.interface';

const CategoryCarouselSlide: React.FC<ICategoryCarouselSlideProps> = ({ category }) => {
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
                <div className="flex w-full h-[300px] bg-stone-100 rounded-2xl"> {/* Cada slide tendrá una altura fija de 300px */}
                    {/* Área de la imagen (60% del ancho) */}
                    <div className="w-3/5 relative overflow-hidden rounded-2xl bg-stone-100">
                        <Image
                            src={`/categories_carousel/${category.imgCategory}`}
                            alt={category.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (min-width: 769px) 60vw"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    {/* Área del texto (40% del ancho) */}
                    <div className="w-2/5 flex flex-col justify-center px-4 py-2 ">
                        <h2 className="text-xl md:text-2xl font-bold text-teal-700">{capitalizeFirstLetter(category.title)}</h2>
                        <p className="mt-2 text-base md:text-lg font-medium text-gray-600 overflow-hidden text-ellipsis">{category.description}</p>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CategoryCarouselSlide;
