import type { IBackendRes } from "types/backend";
import type { IVocabulary } from "types/vocabulary.type";
import instance from "services/axios.customize";

export const fetchRecentNotebookAPI = () => {
    const url_backend = `/api/v1/notebook/recent`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}