import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateVocabulary, IVocabulary } from "types/vocabulary.type";
import instance from "services/axios.customize";

export const fetchVocabulariesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/vocabularies?${query}`;
    return instance.get<IBackendRes<IVocabulary[]>>(url_backend);
}

export const createVocabularyAPI = (data: ICreateVocabulary) => {
    const url_backend = `/api/v1/admin/vocabularies`;
    return instance.post<IResponse<IVocabulary>>(url_backend, data);
}