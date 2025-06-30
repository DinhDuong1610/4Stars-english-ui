export interface IRole {
    id: number;
    name: string;
}

export interface IBadge {
    id: number;
    name: string;
    image: string;
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    active: boolean;
    point: number;
    streakCount: number;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    role: IRole;
    badge: IBadge;
}

export interface ICreateUser {
    name: string;
    email: string;
    password?: string;
    roleId: number;
    badgeId: number;
}