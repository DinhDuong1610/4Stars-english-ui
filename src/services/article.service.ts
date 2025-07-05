import type { IArticle, ICreateArticle } from "types/article.type";
import type { IBackendRes, IResponse } from "types/backend";
import instance from "services/axios.customize";

export const fetchArticlesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/articles?${query}`;
    return instance.get<IBackendRes<IArticle[]>>(url_backend);
}

export const createArticleAPI = (data: ICreateArticle) => {
    const url_backend = `/api/v1/admin/articles`;
    return instance.post<IResponse<IArticle>>(url_backend, data);
}
