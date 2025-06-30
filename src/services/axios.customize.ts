import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    // const token = localStorage.getItem('token');
    const token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjpbIkFETUlOIl0sImV4cCI6MTc1ODk2MzQ1MywiaWF0IjoxNzUwMzIzNDUzLCJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsIm5hbWUiOiJBZG1pbiJ9fQ.kb33lLR2tZjuLSyf7DcBorqgTy4qi9d6XzjMJ-FELPkgsQx3N6QRIt-A5Mj6QT0xG6ty5StO_AUkvV2wPPdDLQ';
    const auth = token ? `Bearer ${token}` : '';
    config.headers.Authorization = auth;
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data && response.data.data) return response.data;
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.response && error.response.data) return error.response.data;
    return Promise.reject(error);
});

export default instance