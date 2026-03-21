import type { ImageLoaderProps } from 'next/image';

/**
 * Loader personalizado de Next.js para entornos Docker en producción.
 * Se ejecuta server-side en el endpoint /_next/image.
 *
 * Reescribe NEXT_PUBLIC_IMAGE_SERVER_URL (localhost:8090) → INTERNAL_IMAGE_SERVER_URL
 * (imageserver) para que el servidor pueda alcanzar el nginx por la red interna Docker.
 * El navegador sigue usando la URL pública — solo afecta a la petición server-side.
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
    const publicBase = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL ?? '';
    const internalBase = process.env.INTERNAL_IMAGE_SERVER_URL ?? '';

    let resolvedSrc = src;

    if (internalBase && publicBase && src.startsWith(publicBase)) {
        resolvedSrc = internalBase + src.slice(publicBase.length);
    }

    const url = new URL(resolvedSrc);
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality ?? 75));
    return url.toString();
}
