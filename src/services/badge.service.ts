import type { IBackendRes } from "types/backend";
import type { IBadge } from "types/badge.type";
import instance from "services/axios.customize";

export const fetchBadgesAPI = (query: string) => {
    return instance.get<IBackendRes<IBadge[]>>(`/api/v1/admin/badges?${query}`);
}