// Pure utility — válida tanto en Client Components como en Server Components

/**
 * Tipos de imagen disponibles en el servidor de imágenes.
 * Cada tipo mapea a una carpeta del nginx:
 *   avatar         → /avatars/{filename}
 *   avatar-default → /avatars/default/{filename}
 *   route          → /routes/{filename}
 *   category       → /categories/{filename}
 *   background     → /backgrounds/{filename}
 */
export type ImageType = 'avatar' | 'avatar-default' | 'route' | 'category' | 'background';

const PATH_MAP: Record<ImageType, string> = {
    'avatar': 'avatars',
    'avatar-default': 'avatars/default',
    'route': 'routes',
    'category': 'categories',
    'background': 'backgrounds',
};

function buildUrl(baseUrl: string, type: ImageType, filename: string): string {
    return `${baseUrl}/${PATH_MAP[type]}/${filename}`;
}

/**
 * Genera la URL absoluta de una imagen para uso en el cliente (navegador).
 * Usa NEXT_PUBLIC_IMAGE_SERVER_URL → http://localhost:8090
 *
 * Los avatares por defecto (avatar-default-*.png) se autodetectan por nombre y se
 * redirigen a /avatars/default/ sin que el componente tenga que especificarlo.
 */
export function getImageUrl(type: ImageType, filename: string): string {
    const base = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL ?? '';

    const resolvedType: ImageType =
        type === 'avatar' && filename.startsWith('avatar-default-')
            ? 'avatar-default'
            : type;

    return buildUrl(base, resolvedType, filename);
}

/**
 * Genera la URL absoluta de una imagen para uso en el servidor (Server Components, generateMetadata).
 * Usa INTERNAL_IMAGE_SERVER_URL → http://imageserver:80 (red interna de Docker).
 * Si no está definida, hace fallback a NEXT_PUBLIC_IMAGE_SERVER_URL.
 *
 * No llamar desde Client Components — expone la URL interna de Docker al cliente.
 * 
 * Los avatares por defecto (avatar-default-*.png) se autodetectan por nombre y se
 * redirigen a /avatars/default/ sin que el componente tenga que especificarlo.
 */
export function getServerImageUrl(type: ImageType, filename: string): string {
    const base =
        process.env.INTERNAL_IMAGE_SERVER_URL ??
        process.env.NEXT_PUBLIC_IMAGE_SERVER_URL ??
        '';

    const resolvedType: ImageType =
        type === 'avatar' && filename.startsWith('avatar-default-')
            ? 'avatar-default'
            : type;

    return buildUrl(base, resolvedType, filename);
}

/**
 * Placeholder en base64 (PNG gris 1×1 px) para el prop blurDataURL de next/image.
 * @example
 * <Image src={getImageUrl('route', filename)} placeholder="blur" blurDataURL={BLUR_DATA_URL} />
 */
export const BLUR_DATA_URL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
