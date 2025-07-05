export interface ICategory {
    id: number;
    name: string;
    description: string;
    type: string;
    orderIndex?: number | null;
    parentId: number | null;
    subCategories: ICategory[];
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface ICreateCategory {
    name: string;
    description: string;
    type: string;
    orderIndex?: number | null;
    parentId?: number | null;
}

export interface IUpdateCategory extends ICreateCategory {
    id: number;
}