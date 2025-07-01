import type { IBackendRes } from "types/backend";
import type { IPlan } from "types/plan.type";
import instance from "services/axios.customize";

export const fetchPlansAPI = (query: string) => {
    const url_backend = `/api/v1/admin/plans?${query}`;
    return instance.get<IBackendRes<IPlan[]>>(url_backend);
}