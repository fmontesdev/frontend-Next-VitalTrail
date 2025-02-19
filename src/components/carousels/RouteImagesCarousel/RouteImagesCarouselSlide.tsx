"use client";

import { motion } from "framer-motion";
import { IImageRoute } from "@/shared/interfaces/entities/imageRoute.interface";

const RouteImagesCarouselSlide: React.FC<{ image: IImageRoute }> = ({ image }) => {
    // Variantes de animación para el slide
    const slideVariants = {
        initial: { x: "100%", opacity: 0 },  // Entra desde la derecha
        animate: { x: "0%", opacity: 1 },    // Se ubica al centro
        exit: { x: "-100%", opacity: 0 }, // Sale hacia la izquierda
    };

    // Ajuste de transición (tiempo y tipo de easing)
    const slideTransition = {
        duration: 0.5,
        ease: "easeInOut",
    };

    return (
        <motion.img
            key={image.idImg}
            src={`/route_images/${image.imgRoute}`}
            alt={`Imagen ${image.idImg} - ruta ${image.route}`}
            className="absolute top-0 left-0 w-full h-full object-cover"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideTransition}
        />
    );
}

export default RouteImagesCarouselSlide;
