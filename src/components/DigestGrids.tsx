import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid'
import { Digest } from '@/model/Digest'
import { DigestChart } from './DigestChart'

const customToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport/>
    </GridToolbarContainer>
  )
}

type GridRow = {
  [key: string]: number
}

export const DigestGrids = (props: {
  rawTitles: string[]
  digestMap: Map<number, Digest[]>
}) => {
  const { rawTitles, digestMap } = props

  const gridColumns = [
    {
      field: "id",
      headerName: "学籍番号",
    },
    ...rawTitles.map((rawTitle) => ({
      field: rawTitle,
      headerName: rawTitle,
    })),
    {
      field: "ave",
      headerName: "平均",
    },
  ]

  const gridRow = [...digestMap.keys()].map((studentNumber) => {
    const digests = digestMap.get(studentNumber)
    const row: GridRow = { id: studentNumber }
    let allQuestionCount = 0
    let allCorrectCount = 0
    digests?.forEach((digest) => {
      row[`${digest.subjectName}_${digest.times}`] = digest.correctRate
      allQuestionCount += digest.questionCount
      allCorrectCount += digest.correctCount
    })
    row['ave'] = allCorrectCount / allQuestionCount
    
    return row
  })

  return (
    <DataGrid
      columns={gridColumns}
      rows={gridRow}
      components={{
        Toolbar: customToolbar,
        Footer: () => (
          <DigestChart digestMap={digestMap}/>
        )
      }}
    />
  )
}
