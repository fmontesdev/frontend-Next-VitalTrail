import { ReactNode } from 'react';
import { ICategoryRoute } from "../entities/categoryRoute.interface";

export interface IQueryClientProviderProps {
    children: ReactNode;
}

export interface ICategoriesCarouselProps {
    categories: ICategoryRoute[];
}

export interface ICategoryCarouselSlideProps {
    category: ICategoryRoute;
}

export interface IMobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}