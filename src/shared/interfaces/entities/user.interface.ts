export interface IUser {
    idUser: string;
    email?: string;
    username: string;
    name: string;
    surname: string;
    birthday?: string;
    bio?: string;
    imgUser: string;
    rol?: string;
    isActive?: boolean;
    isDeleted?: boolean;
    isPremium?: boolean;
    admin?: IAdmin | null;
    client?: IClient | null;
}

export interface IAdmin {
    idAdmin: number;
    user: string;
}

export interface IClient {
    idClient?: number;
    user?: string;
    phone?: string | null;
    customerId?: string | null;
    paymentMethodId?: string | null;
}

export interface ILogin {
    user: {
        email: string;
        password: string;
    }
}

export interface IUserLogin {
    idUser: string;
    email: string;
    username: string;
    token: string;
    refreshToken: string;
    name: string;
    surname: string;
    birthday?: string;
    bio?: string;
    imgUser: string;
    rol: string;
    isActive: boolean;
    isDeleted: boolean;
    isPremium: boolean;
    admin?: IAdmin;
    client?: IClient;
}

export interface IRegister {
    user: {
        email: string;
        username: string;
        password: string;
        name: string;
        surname: string;
        birthday?: string;
        bio?: string;
        imgUser?: string;
        rol?: string;
        admin?: IAdmin;
        client?: IClient;
    }
}

export interface IProfile {
    email: string;
    username: string;
    name: string;
    surname: string;
    birthday?: string;
    bio?: string;
    imgUser: string;
    admin?: IAdmin | null;
    client?: IClient | null;
    following: boolean;
    countFollowers: number;
    countFollowings: number;
}

export interface IProfiles {
    profiles: Array<IProfile>;
    profilesCount: number;
}

export interface IUpdProfile {
    user: {
        password?: string;
        name?: string;
        surname?: string;
        birthday?: string | null;
        bio?: string;
        imgUser?: string;
    }
}
