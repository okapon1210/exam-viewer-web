import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { Result, CorrectCount } from '@/model/Result'
import { Times, Subject, Summary, NewSummary} from '@/model/Summary'
import { GridArea } from '@/components/GridArea'
// eslint-disable-next-line import/default
import ExtractAnswerWorker from '@/workers/ExtractAnswer?worker'

const extractAnswerWorker = new ExtractAnswerWorker()

export const ExtractPage = () => {
  const [results, setResults] = useState<Result[]>([])
  const [titles, setTitles] = useState<string[]>([])
  const resultMapRef = useRef(new Map<number, Subject>())
  const summaryMapRef = useRef(new Map<number, Summary>())

  extractAnswerWorker.onmessage = (ev: MessageEvent<Result[]>) => {
    const resultMap = resultMapRef.current
    const summaryMap = summaryMapRef.current
    ev.data.forEach(result => {
      const summary: Summary = summaryMap.get(result.studentNumber) || NewSummary()
      summary.correctCount += CorrectCount(result)
      summary.questionCount += result.answers.length
      summaryMap.set(result.studentNumber, summary)
      const subjectMap: Subject = resultMap.get(result.studentNumber) || new Map();
      const timesMap: Times = subjectMap.get(result.subjectName) || new Map()
      timesMap.set(result.times, result)
      subjectMap.set(result.subjectName, timesMap);
      resultMap.set(result.studentNumber, subjectMap);
    })
    setResults((oldResults) => [...oldResults, ...ev.data]);
  }

  const onFileChanged = async (ev: ChangeEvent<HTMLInputElement>) => {
    setResults([])
    resultMapRef.current.clear()
    if (ev.target.files) {
      const rowTitles: string[] = []
      for (let i = 0; i < ev.target.files.length; i++) {
        const rowTitle = ev.target.files[i].name.match(/^[^\s|_]+_\d+/)?.[0]
        if (!rowTitle) {
          console.error("file name is not valid: ", ev.target.files[i].name);
          continue
        }
        rowTitles.push(rowTitle);
        const arrBuf = await ev.target.files[i].arrayBuffer()
        extractAnswerWorker.postMessage({
          title: rowTitle,
          arrBuf: arrBuf
        }, [arrBuf])
      }
      setTitles(rowTitles)
    }
  }

  const gridArea = useMemo(() => (
    <GridArea
      titles={titles}
      resultMap={resultMapRef.current}
      summaryMap={summaryMapRef.current}
    />
  ), [results])

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input type="file" multiple accept="text/csv" onChange={onFileChanged} />
      { gridArea }
    </Box>
  );
}
