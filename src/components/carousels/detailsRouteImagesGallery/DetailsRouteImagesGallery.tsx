'use client';

import { useState } from "react";
import DetailsRouteImagesSlide from "./DetailsRouteImagesSlide";
import DetailsRouteImagesPreview from "./DetailsRouteImagesPreview";
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IDetailsRouteImagesGalleryProps } from "@/shared/interfaces/props/props.interface";

export default function DetailsRouteImagesCarousel({ images, initialIndex = 0, onClose }: IDetailsRouteImagesGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
            <DetailsRouteImagesSlide image={images[currentIndex]} />

            <button
                onClick={onClose}
                className="absolute top-7 right-8 p-2 rounded-full bg-stone-100 text-red-700 hover:scale-110 transform transition-transform duration-300 z-100"
            >
                <XMarkIcon strokeWidth={3} className="w-8 h-8" />
            </button>

            <button
                onClick={prevImage}
                className="absolute left-8 p-2 rounded-full bg-stone-100 text-lime-500 hover:scale-110 transform transition-transform duration-300 z-100"
            >
                <ChevronLeftIcon strokeWidth={3} className="w-8 h-8" />
            </button>

            <button
                onClick={nextImage}
                className="absolute right-8 p-2 rounded-full bg-stone-100 text-lime-500 hover:scale-110 transform transition-transform duration-300 z-100"
            >
                <ChevronRightIcon strokeWidth={3} className="w-8 h-8" />
            </button>

            <DetailsRouteImagesPreview images={images} currentIndex={currentIndex} onThumbnailClick={handleThumbnailClick} />
        </div>
    );
}
