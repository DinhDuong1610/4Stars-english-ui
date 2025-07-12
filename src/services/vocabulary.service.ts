import type { IBackendRes } from "types/backend";
import type { IVocabulary } from "types/vocabulary.type";
import instance from "services/axios.customize";

export const fetchVocabulariesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/vocabularies?${query}`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}