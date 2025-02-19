export interface ICategoryRoute {
    idCategory: number;
    title: string;
    imgCategory: string;
    description: string;
}

export interface ICategoryRoutes {
    categories: Array<ICategoryRoute>;
}
