import type { IBackendRes } from "types/backend";
import type { IGrammar } from "types/grammar.type";
import instance from "services/axios.customize";

export const fetchGrammarsAPI = (query: string) => {
    const url_backend = `/api/v1/admin/grammars?${query}`;
    return instance.get<IBackendRes<IGrammar[]>>(url_backend);
}