import { IUser } from "./user.interface";

export interface ICommentRoute {
    id: number;
    slug: string;
    title: string;
    location: string;
    distance: number;
    duration: string;
    difficulty: string;
    typeRoute: string;
    category: string;
}

export interface IComment {
    idComment: number;
    user: IUser;
    route: number | ICommentRoute;
    body: string;
    rating?: number;
    createdAt: string;
}

export interface IComments {
    comments: Array<IComment>;
    averageRatings: number;
}
