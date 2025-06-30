import instance from "./axios.customize";
import type { ICreateUser, IUser } from "types/user.type";
import type { IBackendRes } from "types/backend";

export const fetchUsersAPI = (query: string) => {
    const url_backend = `/api/v1/admin/users?${query}`;
    return instance.get<IBackendRes<IUser[]>>(url_backend);
}

export const createUserAPI = (data: ICreateUser) => {
    const url_backend = '/api/v1/admin/users';
    return instance.post<IBackendRes<IUser>>(url_backend, data);
}