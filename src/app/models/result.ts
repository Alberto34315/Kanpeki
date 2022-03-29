import { Category } from "./category";
import { User } from "./user";

export interface Result {
    idUser: User,
    dateResult: Date,
    result: number,
    category: Category
}
