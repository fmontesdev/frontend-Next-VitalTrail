import { ReactNode } from 'react';
import { IParams } from '../params/params.interface';
import { IRoutes } from '../entities/route.interface';
import { IImageRoute } from '../entities/imageRoute.interface';
import { IComment, IComments } from '../entities/comment.interface';
import { IUser } from "@/shared/interfaces/entities/user.interface";

export interface IQueryClientProviderProps {
    children: ReactNode;
}

export interface IMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: {
        user: IUser | null;
        isAuthenticated: boolean;
    };
    isPremium: boolean | null;
    onLogout: () => void;
}

export interface IRoutesPageClientProps {
    initialRoutes: IRoutes;
    initialParams: IParams;
    limit: number;
}

export interface IRoutesListProps {
    initialRoutes?: IRoutes;
    totalRoutes: number;
    initialFilters?: IParams;
    limit: number;
    params: IParams;
}

export interface IFiltersProps {
    initialParams: IParams;
    onFilterChange: (params: IParams) => void;
}

export interface IPaginationProps {
    totalRoutes: number;
    limit: number;
    params: IParams;
    url: string;
}

export interface IFavoriteButtonProps {
    initialIsFavorite: boolean;
    initialCount: number;
    slug: string;
    origin: string;
}

export interface IDetailsRouteImagesGalleryProps {
    images: IImageRoute[];
    initialIndex?: number;
    onClose: () => void;
}

export interface IDetailsRouteImagesPreviewProps {
    images: IImageRoute[];
    currentIndex: number;
    onThumbnailClick: (index: number) => void;
}

export interface ICommentsListProps {
    routeSlug: string;
    initialComments: IComments;
    commentsCount: number;
    onCommentsCount: (count: number) => void;
}

export interface IProfileCommentsListProps {
    username: string;
    onCommentsCount: (count: number) => void;
}

export interface StripePricingTableProps {
    pricingTableId: string;
    publishableKey: string;
}

export interface ProfileSidebarProps {
    username: string;
    activeTab: 'miContenido' | 'misNotificaciones' | 'miSuscripción' | 'editarPerfil';
    setActiveTab: React.Dispatch<React.SetStateAction<'miContenido' | 'misNotificaciones' | 'miSuscripción' | 'editarPerfil'>>;
}
