import { AnswerDTO } from "../answerDTO";
export interface RequestQuestionDTO {
    statement: string,
    help: string,
    categoryId: number,
    answers?: AnswerDTO[]
}
