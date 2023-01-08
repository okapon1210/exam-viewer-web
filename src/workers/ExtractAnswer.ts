import { Result, NewResult } from "@/model/Result";
import { parseBool } from "@/util/bool";
import { parseCsv } from "@/util/csv";

self.onmessage = (
  ev: MessageEvent<{
    title: string;
    arrBuf: ArrayBuffer;
  }>
) => {
  const { title, arrBuf } = ev.data;
  const [subjectName, timesString] = title.split("_");
  const csv = parseCsv(arrBuf)

  const headers = csv[0];
  const values = csv.slice(1);

  const results: Result[] = []

  values.forEach(row => {
    if (row[0] !== "") {
      const studentNumber = parseInt(row[0], 10)
      const answers: boolean[] = row.slice(1).map(ans => (parseBool(ans)))
      const result = NewResult(
        studentNumber,
        subjectName,
        parseInt(timesString, 10),
        headers,
        answers
      )
      results.push(result)
    }
  })

  self.postMessage(results)
}
