import { GeneralApiProblem } from "./api-problem"

export type GetWordsResult = [{word: string, value: number, length: number}] | GeneralApiProblem
