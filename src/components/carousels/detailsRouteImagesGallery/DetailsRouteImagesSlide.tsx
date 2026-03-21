'use client';

import Image from "next/image";
import { getImageUrl, BLUR_DATA_URL } from '@/shared/utils/imageUrl';
import { IImageRoute } from "@/shared/interfaces/entities/imageRoute.interface";

export default function DetailsRouteImagesSlide({ image }: { image: IImageRoute }) {
    return (
        <div className="relative w-full max-w-4xl flex items-center h-2/4 sm:h-3/5 md:h-2/3 lg:h-4/5">
            <Image
                src={getImageUrl('route', image.imgRoute)}
                alt="Gallery image"
                fill
                sizes="100vw"
                className="w-full h-full object-cover rounded-xl"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
            />
        </div>
    );
}
