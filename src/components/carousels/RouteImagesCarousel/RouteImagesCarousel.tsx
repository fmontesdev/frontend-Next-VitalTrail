"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import RouteImagesCarouselSlide from "./RouteImagesCarouselSlide";
import { IImageRoute } from "@/shared/interfaces/entities/imageRoute.interface";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const RouteImagesCarousel: React.FC<{ images: IImageRoute[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Botón next
    const handleNext = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Botón prev
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    return (
        <div className="relative w-full h-full overflow-hidden group">
            {/* Contenedor para la imagen actual con animaciones */}
            <div className="relative w-full h-full">
                <AnimatePresence initial={false} mode="sync">
                    <RouteImagesCarouselSlide
                        key={images[currentIndex].idImg}
                        image={images[currentIndex]}
                    />
                </AnimatePresence>
            </div>

            {/* Botón prev */}
            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 p-2
                    bg-black/50 text-lime-400 rounded-full opacity-0 group-hover:opacity-100
                    transition-opacity duration-300"
            >
                <ChevronLeftIcon strokeWidth={2} className="w-5 h-5" />
            </button>

            {/* Botón next */}
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 p-2
                    bg-black/50 text-lime-400 rounded-full opacity-0 group-hover:opacity-100
                    transition-opacity duration-300"
            >
                <ChevronRightIcon strokeWidth={2} className="w-5 h-5" />
            </button>
        </div>
    );
}

export default RouteImagesCarousel;
