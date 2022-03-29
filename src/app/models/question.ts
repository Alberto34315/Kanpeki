import { Answer } from "./answer";
import { Category } from "./category";

export interface Question {
    id: number,
    statement: string,
    help: string,
    category: Category,
    answers?: Answer[] 
}
