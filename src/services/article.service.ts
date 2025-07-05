import type { IArticle } from "types/article.type";
import type { IBackendRes } from "types/backend";
import instance from "services/axios.customize";

export const fetchArticlesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/articles?${query}`;
    return instance.get<IBackendRes<IArticle[]>>(url_backend);
}
