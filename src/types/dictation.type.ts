export interface ICategory {
    id: number;
    name: string;
}

export interface IDictationSentence {
    id: number;
    correctText: string;
    audioUrl: string;
    orderIndex: number;
}

export interface IDictationTopic {
    id: number;
    title: string;
    description: string;
    category: ICategory;
    sentences: IDictationSentence[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
}

export interface ICreateDictationSentence {
    audioUrl: string;
    correctText: string;
    orderIndex: number;
}

export interface ICreateDictationTopic {
    title: string;
    description?: string;
    categoryId: number;
    sentences: ICreateDictationSentence[];
}

export interface IUpdateDictationTopic extends ICreateDictationTopic {
    id: number;
}