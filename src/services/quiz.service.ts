import type { IBackendRes } from "types/backend";
import type { IQuiz } from "types/quiz.type";
import instance from "services/axios.customize";

export const fetchQuizzesAPI = (query: string) => {
    const url = `/api/v1/admin/quizzes?${query}`;
    return instance.get<IBackendRes<IQuiz[]>>(url);
}