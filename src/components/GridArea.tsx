import { DataGrid, GridToolbarExport, GridToolbarContainer } from '@mui/x-data-grid'
import { Subject, Summary } from '@/model/Summary'
import { CorrectRate } from '@/model/Result'
import { GridChart } from '@/components/GridChart'

const customToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarExport/>
    </GridToolbarContainer>
  )
}

export const GridArea = (props: {
  titles: string[]
  resultMap: Map<number, Subject>
  summaryMap: Map<number, Summary>
}) => {
  const { titles, resultMap, summaryMap } = props

  const gridColumns = [
    {
      field: "id",
      headerName: "学籍番号",
    },
    ...titles.map((title, index) => ({
      field: index.toString(),
      headerName: title,
    })),
    {
      field: "ave",
      headerName: "平均",
    },
  ]

  const gridRow = [...[...resultMap.keys()].map(studentNumber => {
    const row: {[key:string]:number} = {id: studentNumber}
    const summary = summaryMap.get(studentNumber)
    if (summary) {
      row['ave'] = summary.correctCount / summary.questionCount
    } else {
      row['ave'] = 0
    }
    const subjectMap = resultMap.get(studentNumber)
    if (subjectMap) {
      titles.forEach((title, index) => {
        const [subjectName, timesString] = title.split('_')
        const times = parseInt(timesString, 10)
        const timesMap = subjectMap.get(subjectName)
        if (timesMap) {
          const result = timesMap.get(times)
          if (result) {
            return row[index.toString()] = CorrectRate(result)
          }
        }
        row[index.toString()] = 0
      })
    }
    return row
  })]
  

  return (
    <DataGrid
      columns={gridColumns}
      rows={gridRow}
      components={{
        Toolbar: customToolbar,
        Footer: () => (
          <GridChart titles={titles} resultMap={resultMap} gridRow={gridRow} />
        )
      }}
    />
  )
}
