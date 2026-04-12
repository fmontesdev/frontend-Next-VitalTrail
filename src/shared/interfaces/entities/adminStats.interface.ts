export interface IAdminUserStats {
    total: number;
    newThisMonth: number;
    premium: number;
    free: number;
    conversionRate: number;
}

export interface IAdminRouteStats {
    total: number;
    newThisMonth: number;
}

export interface IAdminSessionStats {
    total: number;
    thisMonth: number;
    totalKm: number;
}

export interface IAdminStats {
    users: IAdminUserStats;
    routes: IAdminRouteStats;
    sessions: IAdminSessionStats;
}

export interface IUserGrowthPoint {
    month: string;
    newUsers: number;
    newPremium: number;
}

export interface IRouteGrowthPoint {
    month: string;
    newRoutes: number;
}
