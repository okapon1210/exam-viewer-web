import { Digest, ReceiveData, Title } from "@/model/Digest";
import { parseBool } from "@/util/bool";
import { parseCsv } from "@/util/csv";

self.onmessage = (
  ev: MessageEvent<{
    rawTitle: string;
    arrBuf: ArrayBuffer;
  }>
) => {
  const { rawTitle, arrBuf } = ev.data;
  const [subjectName, timesString] = rawTitle.split("_")
  const times = parseInt(timesString, 10)
  const title: Title = {
    subjectName,
    times
  }

  const csv = parseCsv(arrBuf);

  const values = csv.slice(1);

  const digests: Digest[] = []
  values.forEach((row, index) => {
    if (row[0] !== "") {
      const studentNumber = parseInt(row[0], 10);
      if (isNaN(studentNumber)) {
        console.error(`${rawTitle} line ${index + 1} is NaN`)
      }

      const rawAnswers = row.slice(1)
      let correctCount = 0
      rawAnswers.forEach((ans) => {
        if (parseBool(ans)) {
          correctCount++
        }
      })
      const correctRate = correctCount / rawAnswers.length

      digests.push(new Digest(
        studentNumber,
        subjectName,
        times,
        rawAnswers.length,
        correctCount,
        correctRate
      ))
    }
  })

  self.postMessage({
    digests: digests,
    titles: [title],
  })
};
