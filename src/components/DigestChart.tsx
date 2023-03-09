import { Box } from "@mui/system";
import { useGridApiContext, useGridApiEventHandler, GridFooter, GridColumns, GridColumnVisibilityModel } from "@mui/x-data-grid"
import { Fragment, useState } from "react"
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, Tooltip } from 'recharts'
import { Digest } from "@/model/Digest";
import { getColorCode } from "@/util/color";


function getCorrectRate(digest: Digest) {
  return digest.correctRate
}

export const DigestChart = (props: {
  digestMap: Map<number, Digest[]>
}) => {
  const { digestMap } = props
  const [selectedSubject, setSelectedSubject] = useState('')
  const [row, setRow] = useState()
  const [columns, setColumns] = useState<GridColumns>()
  const [visibility, setVisibility] = useState<GridColumnVisibilityModel>()
  const apiRef = useGridApiContext();

  useGridApiEventHandler(apiRef, 'rowClick', (params) => {
    setRow(params.row)
    setColumns(params.columns)
  })

  useGridApiEventHandler(apiRef, 'columnVisibilityModelChange', (params) => {
    setVisibility(params)
  })

  useGridApiEventHandler(apiRef, 'columnHeaderClick', (params) => {
    setSelectedSubject(params.field.split('_')[0]||'')
  })

  const eachSubjectLines = [...digestMap.keys()].map((studentNumber) => {
    const eachSubjectDigests = digestMap.get(studentNumber)?.filter((digest) => digest.subjectName === selectedSubject) || []
    const sortedEachSubjectDigests = eachSubjectDigests.sort((a, b) => {
      if (a.subjectName === b.subjectName) {
        return a.times - b.times
      }

      if (a.subjectName < b.subjectName) {
        return -1
      } else {
        return 1
      }
    })
    const studentNumberString = studentNumber.toString()
    return (
      <Line
        key={studentNumber}
        data={sortedEachSubjectDigests}
        dot
        dataKey={getCorrectRate}
        name={studentNumberString}
        stroke={getColorCode(studentNumberString)}
      />
    )
  })

  return (
    <Fragment>
      <GridFooter />
      <Box
        sx={{
          flex: 1,
          height: "30vh",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart>
            <XAxis dataKey="times" allowDuplicatedCategory={false} />
            <YAxis />
            {eachSubjectLines}
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Fragment>
  )
}
