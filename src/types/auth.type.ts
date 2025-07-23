import type { IUser } from "types/user.type";

export interface ILoginCredentials {
    username: string;
    password: string;
}

export interface IRegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface ILoginResponse {
    accessToken: string;
    user: IUser;
}