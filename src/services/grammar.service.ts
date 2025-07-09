import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateGrammar, IGrammar } from "types/grammar.type";
import instance from "services/axios.customize";

export const fetchGrammarsAPI = (query: string) => {
    const url_backend = `/api/v1/admin/grammars?${query}`;
    return instance.get<IBackendRes<IGrammar[]>>(url_backend);
}

export const createGrammarAPI = (data: ICreateGrammar) => {
    const url_backend = `/api/v1/admin/grammars`;
    return instance.post<IResponse<IGrammar>>(url_backend, data);
}