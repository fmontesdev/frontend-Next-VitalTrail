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
    favorited: boolean;
    favoritesCount: number;
    user?: IUser | string;
    images: Array<IImageRoute>;
    comments?: Array<IComment>;
    averageRatings: number;
}

export interface IRoutes {
    routes: Array<IRoute>;
    routesCount: number;
}

export interface ICoordinates {
    lat: number;
    lng: number;
}