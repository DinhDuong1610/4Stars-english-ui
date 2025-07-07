import type { IBackendRes } from "types/backend";
import type { IVideo } from "types/video.type";
import instance from "services/axios.customize";

export const fetchVideosAPI = (query: string) => {
    const url_backend = `/api/v1/admin/videos?${query}`;
    return instance.get<IBackendRes<IVideo[]>>(url_backend);
}