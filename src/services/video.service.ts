import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateVideo, IUpdateVideo, IVideo } from "types/video.type";
import instance from "services/axios.customize";

export const fetchVideosAPI = (query: string) => {
    const url_backend = `/api/v1/admin/videos?${query}`;
    return instance.get<IBackendRes<IVideo[]>>(url_backend);
}

export const createVideoAPI = (data: ICreateVideo) => {
    const url_backend = `/api/v1/admin/videos`;
    return instance.post<IResponse<IVideo>>(url_backend, data);
}

export const updateVideoAPI = (data: IUpdateVideo) => {
    const url_backend = `/api/v1/admin/videos/${data.id}`;
    return instance.put<IResponse<IVideo>>(url_backend, data);
}