import type { IBackendRes } from "types/backend";
import type { IBadge, ICreateBadge } from "types/badge.type";
import instance from "services/axios.customize";

export const fetchBadgesAPI = (query: string) => {
    return instance.get<IBackendRes<IBadge[]>>(`/api/v1/admin/badges?${query}`);
}

export const createBadgeAPI = (data: ICreateBadge) => {
    const url_backend = '/api/v1/admin/badges';
    return instance.post<IBackendRes<IBadge>>(url_backend, data);
}