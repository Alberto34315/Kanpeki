import { AnswerDTO } from "../answerDTO";

export interface responseQuestionDTO {
    id: number,
    statement: string,
    help: string,
    categoryId: number,
    answers?: AnswerDTO[]
}
