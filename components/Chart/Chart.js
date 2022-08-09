import { Box, Typography } from "@mui/material";
import {
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
  Line,
  Brush,
} from "recharts";
import { useFilter } from "../../contexts/FilterContext";
import { useData } from "../../contexts/DataContext";
import { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

/** @type{import("../../utils/types").GenerateOutputTemplate} */
const generateOutputTemplate = (
  startMonth,
  startYear,
  endMonth,
  endYear,
  outletNames
) => {
  const mainOutput = [];
  const staffOutput = [];
  const dwOutput = [];
  const traineeOutput = [];
  dayjs.extend(customParseFormat);

  for (let year = startYear; year <= endYear; year++) {
    const innerLoopStart = year == startYear ? startMonth : 1;
    const innerLoopEnd = year == endYear ? endMonth : 12;
    for (let month = innerLoopStart; month <= innerLoopEnd; month++) {
      const copy0 = outletNames.reduce(
        (before, now) => ({
          ...before,
          [now]: 0,
        }),
        {}
      );
      copy0.month = dayjs(`${month}/${year}`, "M/YYYY").format("MM/YY");
      const copy1 = structuredClone(copy0);
      const copy2 = structuredClone(copy0);
      const copy3 = structuredClone(copy0);

      mainOutput.push(copy0);
      staffOutput.push(copy1);
      dwOutput.push(copy2);
      traineeOutput.push(copy3);
    }
  }

  return {
    mainOutput,
    staffOutput,
    dwOutput,
    traineeOutput,
  };
};

function Chart() {
  const { isFilterReady, Filter } = useFilter();
  const { dataGroup, dataLoading } = useData();
  const [chartData, setChartData] = useState(null);
  const [filterUnit, setFilterUnit] = useState("");

  useEffect(() => {
    dayjs.extend(customParseFormat);
    if (dataLoading || !isFilterReady) {
      return;
    }
    if (Filter.dataType == "Turnover Rate") {
      setFilterUnit("%");
    } else {
      setFilterUnit("");
    }
    const { Data } = dataGroup;
    const temp = {};
    const { mainOutput, staffOutput, dwOutput, traineeOutput } =
      generateOutputTemplate(
        Filter.startMonth,
        Filter.startYear,
        Filter.endMonth,
        Filter.endYear,
        Filter.outletNames
      );
    // const years = [];
    // for(let workingYear = Filter.startYear; workingYear <= Filter.endYear; workingYear++) {
    //   years.push()
    // }
    // filter the outlet names
    Filter.outletNames.forEach((name) => {
      temp[name] = Data[name];
    });

    // counter index for the outputs
    let counter = 0;

    // start looping the outlet names
    Object.keys(temp).forEach((name) => {
      // looping the year
      Object.keys(temp[name])
        .filter((v) => v >= Filter.startYear && v <= Filter.endYear)
        .forEach((year) => {
          console.log({year})
          // working month = the months within filter
          let workingMonths = [];
          if (year == Filter.startYear) {
            workingMonths = Object.keys(Data[name][year]).filter(
              (month) => month >= Filter.startMonth
            );
          } else if (year == Filter.endYear) {
            workingMonths = Object.keys(Data[name][year]).filter(
              (month) => month <= Filter.endMonth
            );
          } else {
            workingMonths = Object.keys(Data[name][year]);
          }
          // start looping the month and making the actual output
          workingMonths.forEach((month) => {
            /** @type{import("../../utils/types").month} */
            const numMonth = Number(month);
            let staff = 0;
            let dw = 0;
            let trainee = 0;
            const scope = Data[name][year][numMonth];
            switch (Filter.dataType) {
              case "Jumlah Karyawan":
                staff = scope?.akhir?.staff ?? 0;
                dw = scope?.akhir?.dw ?? 0;
                trainee = scope?.akhir?.trainee ?? 0;
                break;
              case "Leaver":
                staff = scope?.leaver?.staff ?? 0;
                dw = scope?.leaver?.dw ?? 0;
                trainee = scope?.leaver?.trainee ?? 0;
                break;
              case "Voluntary Leaver":
                staff = scope?.voluntary?.staff ?? 0;
                dw = scope?.voluntary?.dw ?? 0;
                trainee = scope?.voluntary?.trainee ?? 0;
                break;
              case "Involuntary Leaver":
                if (scope?.leaver?.staff && scope?.voluntary?.staff) {
                  staff = scope.leaver.staff - scope.voluntary.staff;
                }
                if (scope?.leaver?.dw && scope?.voluntary?.dw) {
                  dw = scope.leaver.dw - scope.voluntary.dw;
                }
                if (scope?.leaver?.trainee && scope?.voluntary?.trainee) {
                  trainee = scope.leaver.trainee - scope.voluntary.trainee;
                }
                break;
              case "Turnover Rate":
                if (scope?.leaver?.staff && scope?.akhir?.staff) {
                  staff = Number(
                    (
                      (scope?.leaver?.staff / scope?.akhir?.staff) *
                      100
                    ).toFixed(2)
                  );
                }
                if (scope?.leaver?.dw && scope?.akhir?.dw) {
                  dw = Number(
                    ((scope?.leaver?.dw / scope?.akhir?.dw) * 100).toFixed(2)
                  );
                }
                if (scope?.leaver?.trainee && scope?.akhir?.trainee) {
                  trainee = Number(
                    (
                      (scope?.leaver?.trainee / scope?.akhir?.trainee) *
                      100
                    ).toFixed(2)
                  );
                }
              default:
                break;
            }
            staffOutput[counter][name] = staff;
            dwOutput[counter][name] = dw;
            traineeOutput[counter][name] = trainee;
            mainOutput[counter][name] = Number(
              (staff + trainee + dw).toFixed(2)
            );
            counter += 1;
          });
        });
    counter = 0;
    });
    setChartData({ mainOutput, staffOutput, dwOutput, traineeOutput });
  }, [dataLoading, isFilterReady, Filter, dataGroup]);

  return (
    <Box>
      <ChartCore
        title="Semua Karyawan"
        data={chartData?.mainOutput}
        unit={filterUnit}
        yKeys={Filter.outletNames}
      />
      <ChartCore
        title="Staff"
        data={chartData?.staffOutput}
        unit={filterUnit}
        yKeys={Filter.outletNames}
      />
      <ChartCore
        title="Dw"
        data={chartData?.dwOutput}
        unit={filterUnit}
        yKeys={Filter.outletNames}
      />
      <ChartCore
        title="Trainee"
        data={chartData?.traineeOutput}
        unit={filterUnit}
        yKeys={Filter.outletNames}
      />
    </Box>
  );
}

const COLORS = [
  "#2980b9",
  "#27ae60",
  "#16a085",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#95a5a6",
  "#5f27cd",
  "#f368e0",
  "#6ab04c",
  "#7ed6df",
  "#006266",
  "#ff5252",
  "#833471",
  "#2c3e50",
];

// box-shadow: 4px 4px 19px 4px rgba(0,0,0,0.25);



function ChartCore({ data, yKeys, title, unit }) {
  return (
    data && (
      <Box my={2} sx={{ borderRadius: "16px", backgroundColor:'white', boxShadow:"4px 4px 12px 2px rgba(0,0,0,0.1)"}} pr={3} pt={2} pb={2}>
        <Typography variant="h6" component="h2" fontWeight={400} px="2em">
          {title}
        </Typography>
        <LineChart width={750} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.8} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Line
              key={key}
              unit={unit}
              type="monotone"
              dataKey={key}
              stroke={COLORS[Math.floor(Math.random() * 14)]}
              animationEasing="ease-out"
              strokeWidth={1}
            />
          ))}
          <Brush
            dataKey="month"
            startIndex={0}
            endIndex={data.length > 12 ? 11 : data.length - 1}
            height={24}
          />
        </LineChart>
      </Box>
    )
  );
}
export default Chart;
