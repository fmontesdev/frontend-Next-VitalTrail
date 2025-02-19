'use client';

import { useState } from "react";
import Image from "next/image";
import DetailsRouteImagesGallery from "../carousels/detailsRouteImagesGallery/DetailsRouteImagesGallery";
import { IImageRoute } from "@/shared/interfaces/entities/imageRoute.interface";
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function DetailsRouteImages({ images }: { images: IImageRoute[] }) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryIndex, setGalleryIndex] = useState(0);

    const openGallery = (index: number) => {
        setGalleryIndex(index);
        setIsGalleryOpen(true);
    };

    return (
        <>
            {isGalleryOpen && (
                <DetailsRouteImagesGallery images={images} initialIndex={galleryIndex} onClose={() => setIsGalleryOpen(false)} />
            )}
            <div className="relative grid grid-cols-2 gap-1 rounded-b-2xl md:rounded-br-none md:rounded-l-2xl overflow-hidden">
                <div className="col-span-2 h-64 relative cursor-pointer" onClick={() => openGallery(0)}>
                    <Image
                        src={`/route_images/${images[0].imgRoute}`}
                        alt="Preview image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/15 transition duration-300"></div>
                </div>
                <div className="h-36 relative cursor-pointer" onClick={() => openGallery(1)}>
                    <Image
                        src={`/route_images/${images[1].imgRoute}`}
                        alt="Preview image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/15 transition duration-300"></div>
                </div>
                <div className="h-36 relative cursor-pointer" onClick={() => openGallery(2)}>
                    <Image
                        src={`/route_images/${images[2].imgRoute}`}
                        alt="Preview image"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/15 transition duration-300"></div>
                </div>
                <button
                    onClick={() => {
                        images.length <= 3
                        ? openGallery(images.length-1)
                        : openGallery(3)
                    }}
                    className="
                        absolute top-4 left-5 flex items-center gap-2 shrink-0 border-2
                        rounded-full px-4 py-1 font-bold text-white hover:border-lime-400
                        hover:bg-black/40 hover:text-lime-400"
                >
                    <PhotoIcon strokeWidth={2} className="w-6 h-6" />
                    <span className="text-sm">
                        Ver mas fotos
                    </span>
                </button>
            </div>
        </>
    );
}
