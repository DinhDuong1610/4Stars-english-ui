import type { IBackendRes, IResponse } from "types/backend";
import type { ICreateQuiz, IQuiz } from "types/quiz.type";
import instance from "services/axios.customize";

export const fetchQuizzesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/quizzes?${query}`;
    return instance.get<IBackendRes<IQuiz[]>>(url_backend);
}

export const generateQuizAPI = (categoryId: number) => {
    const url_backend = `/api/v1/admin/quizzes/generate-from-category?categoryId=${categoryId}`;
    return instance.post<IBackendRes<IQuiz>>(url_backend);
}

export const deleteQuizAPI = (id: number) => {
    const url_backend = `/api/v1/admin/quizzes/${id}`;
    return instance.delete(url_backend);
}

export const createQuizAPI = (data: ICreateQuiz) => {
    const url_backend = `/api/v1/admin/quizzes`;
    return instance.post<IResponse<IQuiz>>(url_backend, data);
}