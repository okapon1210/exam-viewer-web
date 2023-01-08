import { CorrectRate } from "@/model/Result";
import { Subject, Times } from "@/model/Summary";
import { Box } from "@mui/system";
import { GridEventListener, useGridApiContext, useGridApiEventHandler, GridFooter, GridColumns, GridColumnVisibilityModel } from "@mui/x-data-grid"
import { Fragment, useState } from "react"
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip } from 'recharts'
import CryptoJS from "crypto-js";

export const GridChart = (props: {
  titles: string[]
  resultMap: Map<number, Subject>
  gridRow: any
}) => {
  const { titles, resultMap, gridRow } = props
  const [selectedSubject, setSelectedSubject] = useState('')
  const [row, setRow] = useState()
  const [columns, setColumns] = useState<GridColumns>()
  const [visibility, setVisibility] = useState<GridColumnVisibilityModel>()
  const apiRef = useGridApiContext();
  const handleRowClick: GridEventListener<'rowClick'> = (params) => {
    setRow(params.row)
    setColumns(params.columns)
  }
  useGridApiEventHandler(apiRef, 'rowClick', handleRowClick);
  useGridApiEventHandler(apiRef, 'columnVisibilityModelChange', (params) => {
    setVisibility(params)
  })
  useGridApiEventHandler(apiRef, 'columnHeaderClick', (params) => {
    const titleIndex = parseInt(params.field, 10)
    if (titles[titleIndex]) {
      setSelectedSubject(titles[titleIndex].split('_')[0])
    } else if (titles[0]) {
      setSelectedSubject(titles[0].split('_')[0])
    } else {
      setSelectedSubject('')
    }
  })
  return (
    <Fragment>
      <GridFooter />
      <Box
        sx={{
          flex: 1,
          height: '30vh'
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <XAxis
              dataKey="times"
              allowDuplicatedCategory={false}
            />
            <YAxis />
            {
              [...resultMap.keys()].map(studentNumber => {
                const subjectMap = resultMap.get(studentNumber)
                if (subjectMap && subjectMap.has(selectedSubject)) {
                  const timesMap = subjectMap.get(selectedSubject)
                  const res = [...(timesMap as Times).values()]
                  const strokeColor = `#${CryptoJS.SHA3(studentNumber.toString(), {outputLength: 32}).toString().slice(0,6)}`
                  return (
                    <Line
                      key={studentNumber}
                      data={res}
                      dot
                      dataKey={CorrectRate}
                      name={studentNumber.toString()}
                      stroke={strokeColor}
                    />
                  )
                }
              })
            }
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Fragment>
  )
}
