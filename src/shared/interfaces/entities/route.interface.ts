import { IUser } from "./user.interface";
import { IImageRoute } from "./imageRoute.interface";
import { IComment } from "./comment.interface";

export interface IRoute {
    idRoute: number;
    slug: string;
    category: string;
    title: string;
    description: string;
    location: string;
    distance: number;
    duration: string;
    difficulty: string;
    typeRoute: string;
    coordinates: Array<ICoordinates>;
    createdAt: string;
    updatedAt: string;
    start?: string | null;
    favorited: boolean;
    favoritesCount: number;
    user?: IUser | string;
    images: Array<IImageRoute> | null;
    comments?: Array<IComment>;
    averageRatings: number;
}

export interface IRoutes {
    routes: Array<IRoute>;
    routesCount: number;
}

export interface IFavoriteRoutes {
    favoriteRoutes: Array<IRoute>;
    favoritesRoutesCount: number;
}

export interface ICoordinates {
    lat: number;
    lng: number;
}

export interface ICreateRoute {
    title: string;
    description: string;
    location: string;
    distance: number;       // metros
    duration: number;       // minutos — integer
    difficulty: 'fácil' | 'moderada' | 'difícil' | 'experto';
    typeRoute: 'solo ida' | 'circular';
    coordinates: [number, number][];
    categoryTitle: string;
    images: File[];
}