export type Result = {
  studentNumber: number
  subjectName: string
  times: number
  headers: string[]
  answers: boolean[]
}

export function NewResult(
  studentNumber: number,
  subjectName: string,
  times: number,
  headers: string[],
  answers: boolean[]
) :Result {
  return {
    studentNumber,
    subjectName,
    times,
    headers,
    answers
  }
}
export function CorrectCount(res: Result) {
  let correctCount = 0
  res.answers.forEach(value => {
    if (value) {
      correctCount++
    }
  })
  return correctCount
}

export function CorrectRate(res: Result) {
  const correctCount = CorrectCount(res)
  return correctCount / res.answers.length
}
