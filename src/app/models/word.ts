import { Category } from "./category";

export interface Word {
    id: number,
    english: string,
    spanish: string,
    japanese: string,
    furigana: string,
    URLimage: string,
    category: Category
}
