import type { IBackendRes } from "types/backend";
import type { ICategory } from "types/category.type";
import instance from "services/axios.customize";

export const fetchCategoriesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/categories/tree?${query}`;
    return instance.get<IBackendRes<ICategory[]>>(url_backend);
}