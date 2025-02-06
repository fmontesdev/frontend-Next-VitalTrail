'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CategoryCarouselSlide from './CategoryCarouselSlide';
import { ICategoriesCarouselProps } from '@/shared/interfaces/props/props.interface';

const CategoriesCarousel: React.FC<ICategoriesCarouselProps> = ({ categories }) => {
    const slideHeight = 300;        // Altura fija de cada slide
    const gap = 24;                 // Espacio extra entre slides (24px)
    const effectiveHeight = slideHeight + gap; // Altura "efectiva" de cada slide
    const numSlides = categories.length;

    // Duplicamos los slides para lograr el loop infinito sin interrupciones.
    const extendedSlides = [...categories, ...categories];

    // Índice actual (va incrementando hasta alcanzar numSlides, luego se reinicia)
    const [current, setCurrent] = useState(0);

    // Autoplay: avanzar al siguiente slide cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(prev => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, [numSlides]);

    // Cuando current alcanza numSlides, reiniciarlo a 0 (aprovechando la duplicación)
    useEffect(() => {
        if (current === numSlides) {
            // Esperamos a que termine la animación (0.5s) y luego reiniciamos sin transición
            const timeout = setTimeout(() => {
                setCurrent(0);
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [current, numSlides]);

    return (
        <div className="relative mb-20">
            {/* Contenedor de slides con overflow-hidden */}
            <div
                className="overflow-hidden"
                style={{ height: effectiveHeight * 3 - gap }} // Muestra 3 slides a la vez
            >
                <motion.div
                    className="flex flex-col gap-[24px]"
                    animate={{ y: -current * effectiveHeight }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    {extendedSlides.map((cat, index) => (
                        <div key={index}>
                            <CategoryCarouselSlide category={cat} />
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Contenedor de los dots, colocado fuera del contenedor con overflow-hidden */}
            <div
                className="absolute left-1/2 transform -translate-x-1/2 flex space-x-2"
                style={{ bottom: "-28px" }} // Posicionado 20px por debajo del contenedor de slides
            >
                {categories.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-3 h-3 rounded-full transition-colors ${idx === (current % numSlides) ? 'bg-teal-700' : 'bg-gray-300'
                            }`}
                        aria-label={`Ir al slide ${idx + 1}`}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default CategoriesCarousel;
