import { AnswerDTO } from "../answerDTO";

export interface ResponseQuestionDTO {
    id: number,
    statement: string,
    help: string,
    categoryId: number,
    answers: AnswerDTO[]
}
