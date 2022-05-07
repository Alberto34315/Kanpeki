import { AnswerDTO } from "../answerDTO";
export interface RequestQuestionDTO {
    id?: number,
    statement: string,
    help: string,
    categoryId: number,
    answers?: AnswerDTO[]
}
