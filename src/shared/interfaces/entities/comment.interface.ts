export interface IComment {
    idComment: number;
    user: string;
    route: number;
    body: string;
    rating?: number;
    createdAt: string;
}

export interface IComments {
    comments: Array<IComment>;
}