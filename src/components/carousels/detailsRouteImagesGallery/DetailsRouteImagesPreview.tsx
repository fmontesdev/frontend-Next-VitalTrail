'use client';

import Image from "next/image";
import { getImageUrl, BLUR_DATA_URL } from '@/shared/utils/imageUrl';
import { IDetailsRouteImagesPreviewProps } from "@/shared/interfaces/props/props.interface";

export default function DetailsRouteImagesPreview({ images, currentIndex, onThumbnailClick }: IDetailsRouteImagesPreviewProps) {
    return (
        <div className="w-full flex justify-center space-x-3 px-4 mt-5 overflow-x-auto z-50">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`
                        w-24 h-16 relative cursor-pointer hover:scale-95 transform transition-transform duration-200
                        ${currentIndex === index ? 'border-2 border-white rounded-lg' : ''}`}
                    onClick={() => onThumbnailClick(index)}
                >
                    <Image
                        src={getImageUrl('route', image.imgRoute)}
                        alt={`Thumbnail ${index}`}
                        fill
                        sizes="96px"
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                    />
                </div>
            ))}
        </div>
    );
}