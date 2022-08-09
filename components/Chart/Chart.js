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
  const { Filter: filter, isReady, setFilter } = useFilter();
  const { data, setData } = useData();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    dayjs.extend(customParseFormat);
    if (!data || !filter || !isReady) {
      return;
    }
    const { Data } = data;
    const temp = {};
    const { mainOutput, staffOutput, dwOutput, traineeOutput } =
      generateOutputTemplate(
        filter.startMonth,
        filter.startYear,
        filter.endMonth,
        filter.endYear,
        filter.outletNames
      );

    return;
    // filter the outlet names
    filter.outletNames.forEach((name) => {
      temp[name] = Data[name];
    });

    console.log({ mainOutput, staffOutput, dwOutput, traineeOutput });

    // counter index for the outputs
    let counter = 0;

    // start looping the outlet names
    Object.keys(temp).forEach((name) => {
      // looping the year
      Object.keys(temp[name])
        .filter((v) => v >= filter.startYear && v <= filter.endYear)
        .forEach((year) => {
          // working month = the months within filter
          let workingMonths = [];
          if (year == filter.startYear) {
            workingMonths = Object.keys(Data[name][year]).filter(
              (month) => month >= filter.startMonth
            );
          } else if (year == filter.endYear) {
            workingMonths = Object.keys(Data[name][year]).filter(
              (month) => month <= filter.endMonth
            );
          } else {
            workingMonths = Object.keys(Data[name][year]);
          }
          console.log({ workingMonths, year, filter });
          // start looping the month and making the actual output
          workingMonths.forEach((month) => {
            /** @type{import("../../utils/types").month} */
            const numMonth = Number(month);
            console.log({ counter, name });
            switch (filter.dataType) {
              case "Jumlah Karyawan":
                const { staff, dw, trainee } = Data[name][year][numMonth].akhir;

                staffOutput[counter][name] = staff;
                dwOutput[counter][name] = dw;
                traineeOutput[counter][name] = trainee;
                mainOutput[counter][name] = staff + trainee + dw;
                break;
              default:
                break;
            }

            counter += 1;
          });
        });
    });
    setChartData({ mainOutput, staffOutput, dwOutput, traineeOutput });
    // console.log({ mainOutput, staffOutput, dwOutput, traineeOutput })
  }, [filter, data, isReady]);

  return (
    <Box>
      {chartData?.mainOutput && (
        <Box>
          <Typography variant="h5" component="h2" fontWeight={400} px="2em">
            Semua Karyawan
          </Typography>
          <LineChart width={750} height={250} data={chartData.mainOutput}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="outlet 1"
              stroke="#8884d8"
              animationEasing="ease-out"
              strokeWidth={2}
            />
            <Brush
              dataKey="month"
              startIndex={0}
              endIndex={
                chartData.mainOutput.length > 12
                  ? 11
                  : chartData.mainOutput.length - 1
              }
              height={24}
            />
          </LineChart>
        </Box>
      )}
      {chartData?.staffOutput && (
        <LineChart width={750} height={250} data={chartData.staffOutput}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="outlet 1"
            stroke="#8884d8"
            animationEasing="ease-out"
          />
        </LineChart>
      )}
      {chartData?.dwOutput && (
        <LineChart width={750} height={250} data={chartData.dwOutput}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="outlet 1"
            stroke="#8884d8"
            animationEasing="ease-out"
          />
        </LineChart>
      )}
      {chartData?.traineeOutput && (
        <LineChart width={750} height={250} data={chartData.traineeOutput}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="outlet 1"
            stroke="#8884d8"
            animationEasing="ease-out"
          />
        </LineChart>
      )}
    </Box>
  );
}

// const dummy_data = [
//   {
//     month: "January 2020",
//     outlet1: 10,
//     outlet2: 3,
//     outlet3: 2,
//   },
//   {
//     month: "February 2020",
//     outlet1: 18,
//     outlet2: 2,
//     outlet3: 1,
//   },
//   {
//     month: "March 2020",
//     outlet1: 9,
//     outlet2: 5,
//     outlet3: 3,
//   },
//   {
//     month: "April 2020",
//     outlet1: 7,
//     outlet2: 4,
//     outlet3: 1,
//   },
//   {
//     month: "May 2020",
//     outlet1: 5,
//     outlet2: 4,
//     outlet3: 0,
//   },
// ];

export default Chart;
