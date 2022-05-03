export interface RequestWordDTO {
    id?: number;
    categoryId: number;
    japanese: string;
    english: string;
    spanish: string;
    furigana: string;
    file: File | string;
    urlImage: string;
}
