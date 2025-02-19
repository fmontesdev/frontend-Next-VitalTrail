import { IUser } from "./user.interface";

export interface IComment {
    idComment: number;
    user: IUser;
    route: number;
    body: string;
    rating?: number;
    createdAt: string;
}

export interface IComments {
    comments: Array<IComment>;
    averageRatings: number;
}
