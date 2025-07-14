import type { ILoginCredentials, ILoginResponse } from "types/auth.type";
import type { IResponse } from "types/backend";
import instance from "services/axios.customize";

export const loginAPI = (data: ILoginCredentials) => {
    return instance.post<IResponse<ILoginResponse>>(`/api/v1/auth/login`, data);
}

export const getAccountAPI = () => {
    return instance.get<IResponse<ILoginResponse>>(`/api/v1/auth/account`);
}

export const refreshTokenAPI = () => {
    return instance.post<IResponse<ILoginResponse>>('/api/v1/auth/refresh');
}