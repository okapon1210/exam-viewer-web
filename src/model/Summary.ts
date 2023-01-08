import { Result } from "@/model/Result"

export type Times = Map<number, Result>
export type Subject = Map<string, Times>

export type Summary = {
  correctCount: number
  questionCount: number
}

export function NewSummary(): Summary {
  return {
    correctCount: 0,
    questionCount: 0
  }
}
