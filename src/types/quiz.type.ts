export interface IChoice {
    id: number;
    content: string | null;
    imageUrl: string | null;
    isCorrect: boolean;
}

export interface IQuestion {
    id: number;
    questionType: 'FILL_IN_BLANK' | 'LISTENING_COMPREHENSION' | 'MULTIPLE_CHOICE_IMAGE' | 'MULTIPLE_CHOICE_TEXT';
    prompt: string;
    textToFill: string | null;
    correctSentence: string | null;
    audioUrl: string | null;
    imageUrl: string | null;
    points: number;
    questionOrder: number;
    relatedVocabularyId: number;
    choices: IChoice[];
}

export interface IQuiz {
    id: number;
    title: string;
    description: string;
    categoryId: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string | null;
    questions: IQuestion[];
}
