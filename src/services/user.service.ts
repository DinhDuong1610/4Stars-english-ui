import instance from "./axios.customize";
import type { IUser } from "types/user.type";
import type { IBackendRes } from "types/backend";

export const fetchUsersAPI = (query: string) => {
    const url_backend = `/api/v1/admin/users?${query}`;
    return instance.get<IBackendRes<IUser[]>>(url_backend);
}