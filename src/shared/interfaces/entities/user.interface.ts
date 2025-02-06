export interface IUser {
    idUser: string;
    email: string;
    username: string;
    name: string;
    surname: string;
    bio: string;
    imgUser: string;
    rol: string;
    isActive: boolean;
    isDeleted: boolean;
    isPremium: boolean;
    admin?: IAdmin;
    client?: IClient;
}

export interface IAdmin {
    idAdmin: number;
    user: string;
}

export interface IClient {
    idClient: number;
    user: string;
    phone: string;
}