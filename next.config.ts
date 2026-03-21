import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        // Desactiva el proxy /_next/image — el navegador carga directamente desde localhost:8090.
        // Eliminar en producción cuando imageserver tenga URL pública accesible desde el servidor.
        unoptimized: true,
        // Loader de reserva para cuando se active la optimización en producción.
        // Reescribe localhost:8090 → imageserver (red interna Docker) en tiempo de optimización.
        loaderFile: './src/shared/utils/imageLoader.ts',
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8090',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'imageserver',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
