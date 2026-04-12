export interface IAdminUser {
    idUser: string; // Symfony UUID — string intentional, not a numeric ID
    username: string;
    email: string;
    name: string;
    surname: string;
    imgUser: string;
    rol: string;
    isPremium: boolean;
    isActive: boolean;
    isDeleted: boolean;
    createdAt: string;
}

export interface IAdminUsersPage {
    users: IAdminUser[];
    total: number;
    page: number;
    limit: number;
}
