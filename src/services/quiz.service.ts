import type { IBackendRes } from "types/backend";
import type { IQuiz } from "types/quiz.type";
import instance from "services/axios.customize";

export const fetchQuizzesAPI = (query: string) => {
    const url_backend = `/api/v1/admin/quizzes?${query}`;
    return instance.get<IBackendRes<IQuiz[]>>(url_backend);
}

export const generateQuizAPI = (categoryId: number) => {
    const url_backend = `/api/v1/admin/quizzes/generate-from-category?categoryId=${categoryId}`;
    return instance.post<IBackendRes<IQuiz>>(url_backend);
}