import { Question } from "./question";

export interface Answer {
    id: number,
    question?: Question,
    answer: string,
    furigana: string,
    isCorrect: boolean 
}
