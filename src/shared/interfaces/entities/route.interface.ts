import { IUser } from "./user.interface";
import { IImageRoute } from "./imageRoute.interface";
import { IComment } from "./comment.interface";

export interface IRoute {
    idRoute: number;
    slug: string;
    category: string;
    title: string;
    distance: number;
    duration: string;
    difficulty: string;
    typeRoute: string;
    coordinates: Array<Coordinates>;
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    user: IUser;
    images: Array<IImageRoute>;
    comments: Array<IComment>;
    averageRatings: number;
}

export interface IRoutes {
    routes: Array<IRoute>;
}

export interface Coordinates {
    lat: number;
    lng: number;
}