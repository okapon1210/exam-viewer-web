export class Digest {
  public studentNumber: number
  public subjectName: string
  public times: number
  public questionCount: number
  public correctCount: number
  public correctRate: number
  constructor(
    studentNumber: number,
    subjectName: string,
    times: number,
    questionCount: number,
    correctCount: number,
    correctRate: number
  ) {
    this.studentNumber = studentNumber
    this.subjectName = subjectName
    this.times = times
    this.questionCount = questionCount
    this.correctCount = correctCount
    this.correctRate = correctRate
  }
}
