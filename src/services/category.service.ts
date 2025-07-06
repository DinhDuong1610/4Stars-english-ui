import type { IBackendRes, IResponse } from "types/backend";
import type { ICategory, ICreateCategory } from "types/category.type";
import instance from "services/axios.customize";

export const fetchCategoriesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/categories/tree?${query}`;
    return instance.get<IBackendRes<ICategory[]>>(url_backend);
}

export const createCategoryAPI = (data: ICreateCategory) => {
    const url_backend = `/api/v1/admin/categories`;
    return instance.post<IResponse<ICategory>>(url_backend, data);
}