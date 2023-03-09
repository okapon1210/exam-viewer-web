import { Digest, Title } from "@/model/Digest"
import { parseCsv } from "@/util/csv"

const CalculatedColumn = {
  studentNumber: 0,
  subjectName: 1,
  times: 2,
  questionCount: 3,
  correctCount: 4,
  correctRate: 5,
} as const

self.onmessage = (
  ev: MessageEvent<{
    arrBuf: ArrayBuffer
  }>
) => {
  const { arrBuf } = ev.data
  const csv = parseCsv(arrBuf)

  const titleMap = new Map<string, Title>()
  const digests: Digest[] = []
  csv.forEach((row) => {
    if (row[CalculatedColumn.studentNumber] !== "") {
      const studentNumber = parseInt(row[CalculatedColumn.studentNumber], 10)
      const subjectName = row[CalculatedColumn.subjectName]
      const times = parseInt(row[CalculatedColumn.times], 10)
      const questionCount = parseInt(row[CalculatedColumn.questionCount], 10)
      const correctCount = parseInt(row[CalculatedColumn.correctCount], 10)
      const correctRate = parseFloat(row[CalculatedColumn.correctRate])

      digests.push({
        studentNumber,
        subjectName,
        times,
        questionCount,
        correctCount,
        correctRate
      })

      const titleString = `${subjectName}_${times}`
      if (!titleMap.has(titleString)) {
        titleMap.set(titleString, {
          subjectName,
          times
        })
      }
    }
  })

  self.postMessage({
    digests: digests,
    titles: [...titleMap.values()],
  })
}
