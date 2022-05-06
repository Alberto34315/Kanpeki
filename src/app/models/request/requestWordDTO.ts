export interface RequestWordDTO {
    id?: number;
    category: number;
    categoryId?: number;
    japanese: string;
    english: string;
    spanish: string;
    furigana: string;
    file: File | string;
    urlImage: string;
}
