import { DataGrid, GridToolbarExport, GridToolbarContainer, GridColumns, GridRow, unstable_resetCleanupTracking } from '@mui/x-data-grid'
import { Digest, Title } from '@/model/Digest'
import { DigestChart } from '@/components/DigestChart'

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
  titles: Title[]
  digestMap: Map<number, Digest[]>
}) => {
  const { titles, digestMap } = props

  const sortedTitles = titles.sort((a, b) => {
    if (a.subjectName === b.subjectName) {
      return a.times - b.times
    }

    if (a.subjectName < b.subjectName) {
      return -1
    } else {
      return 1
    }
  })

  const gridColumns: GridColumns<GridRow> = [
    {
      field: "id",
      headerName: "学籍番号",
    },
    ...sortedTitles.map((title) => ({
      field: `${title.subjectName}_${title.times}`,
      headerName: `${title.subjectName}_${title.times}`,
    })),
    {
      field: "average",
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
    row["average"] = allCorrectCount / allQuestionCount
    
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
