import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { Box, useTheme } from '@mui/material'
import { Digest, ReceiveData, Title } from '@/model/Digest'
import { DigestGrids } from '@/components/DigestGrids'
// eslint-disable-next-line import/default
import GetDigestsWorker from '@/workers/GetDigests?worker'
// eslint-disable-next-line import/default
import ParseCalculatedFileWorker from '@/workers/ParseCalculatedFile?worker'

const getDigestsWorker = new GetDigestsWorker()
const parseCalculatedFileWorker = new ParseCalculatedFileWorker()

export const ViewerPage = () => {
  const [results, setResults] = useState<{ digests: Digest[], titles: Title[] }>({
    digests: [],
    titles: []
  })
  const digestMapRef = useRef(new Map<number, Digest[]>())

  const theme = useTheme()

  const onReceivedDigests = (
    ev: MessageEvent<ReceiveData>
  ) => {
    const { digests, titles: receivedTitles } = ev.data
    const digestMap = digestMapRef.current
    digests.forEach((digest) => {
      digestMap.get(digest.studentNumber)?.push(digest) ||
        digestMap.set(digest.studentNumber, [digest])
    })
    setResults((oldResults) => ({
      digests: oldResults.digests.concat(digests),
      titles: oldResults.titles.concat(receivedTitles)
    }))
  }

  getDigestsWorker.onmessage = onReceivedDigests
  parseCalculatedFileWorker.onmessage = onReceivedDigests

  const onFileChanged = async (ev: ChangeEvent<HTMLInputElement>) => {
    setResults({digests:[],titles:[]})
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
    }
  }

  const onCalculatedFileChanged = async (ev: ChangeEvent<HTMLInputElement>) => {
    setResults({ digests: [], titles: [] })
    digestMapRef.current.clear()
    if (ev.target.files) {
      const arrBuf = await ev.target.files[0].arrayBuffer()
      parseCalculatedFileWorker.postMessage({
        arrBuf: arrBuf,
      }, [arrBuf])
    }
  }

  const gridArea = useMemo(() => (
    <DigestGrids
      titles={results.titles}
      digestMap={digestMapRef.current}
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
      <Box
        sx={{
          height: "4%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label
          css={{
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: "5px",
            borderRadius: "5px",
            verticalAlign: "middle",
          }}
        >
          <input
            type="file"
            multiple
            accept="text/csv"
            onChange={onFileChanged}
            css={{
              display: "none",
            }}
          />
          複数ファイルのアップロード
        </label>
        <label
          css={{
            background: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            padding: "5px",
            borderRadius: "5px",
            verticalAlign: "middle",
          }}
        >
          <input
            type="file"
            accept="text/csv"
            onChange={onCalculatedFileChanged}
            css={{
              display: "none",
            }}
          />
          分析済みファイルのアップロード
        </label>
      </Box>
      <Box
        sx={{
          height: "95%",
          boxSizing: "border-box",
        }}
      >
        {gridArea}
      </Box>
    </Box>
  )
}
