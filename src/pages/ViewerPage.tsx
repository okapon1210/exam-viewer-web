import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
// eslint-disable-next-line import/default
import GetDigestsWorker from '@/workers/GetDigests?worker'
import { Digest } from '@/model/Digest'
import { DigestGrids } from '@/components/DigestGrids'

const getDigestsWorker = new GetDigestsWorker()
export const ViewerPage = () => {
  const [digests, setDigests] = useState<Digest[]>([])
  const [rawTitles, setRawTitles] = useState<string[]>([])
  const digestMapRef = useRef(new Map<number, Digest[]>())

  getDigestsWorker.onmessage = (ev: MessageEvent<Digest[]>) => {
    const digestMap = digestMapRef.current
    ev.data.forEach(digest => {
      console.log('num: ', digest.studentNumber)
      digestMap.get(digest.studentNumber)?.push(digest) || digestMap.set(digest.studentNumber, [digest])
    })
    setDigests((oldDigests) => [...oldDigests, ...ev.data])
  }

  const onFileChanged = async (ev: ChangeEvent<HTMLInputElement>) => {
    setDigests([])
    digestMapRef.current.clear()
    if (ev.target.files) {
      const rawTitles: string[] = []
      for (let i = 0; i < ev.target.files.length; i++) {
        const rawTitle = ev.target.files[i].name.match(/^[^\s|_]+_\d+/)?.[0]
        if (!rawTitle) {
          console.error(`file name is not valid: ${ev.target.files[i].name}`)
          alert(`file name is not valid: ${ev.target.files[i].name}`)
          continue
        }
        rawTitles.push(rawTitle);
        const arrBuf = await ev.target.files[i].arrayBuffer()
        getDigestsWorker.postMessage({
          rawTitle: rawTitle,
          arrBuf: arrBuf
        }, [arrBuf])
      }
      setRawTitles(rawTitles)
    }
  }

  const gridArea = useMemo(() => (
    <DigestGrids
      rawTitles={rawTitles}
      digestMap={digestMapRef.current}
    />
  ), [digests])

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
