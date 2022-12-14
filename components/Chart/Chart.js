import { Box, Skeleton, Typography } from "@mui/material";
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
    setFilterUnit(Filter.dataType == "Turnover Rate" ? "%" : "");
    const { Data } = dataGroup;

    const mainOutput = [];
    const staffOutput = [];
    const dwOutput = [];
    const traineeOutput = [];

    const years = [];
    for (let y = Filter.startYear; y <= Filter.endYear; y++) {
      years.push(y);
    }

    years.forEach((year) => {

      const startMonth = year == Filter.startYear ? Filter.startMonth : 1;
      const endMonth = year == Filter.endYear ? Filter.endMonth : 12;

      for (let month = startMonth; month <= endMonth; month++) {

        const monthProp = dayjs(`${month}/${year}`, "M/YYYY").format("MM/YY");
        const monthlyStaff = { month: monthProp };
        const monthlyDw = { month: monthProp };
        const monthlyTrainee = { month: monthProp };
        const monthlyAll = { month: monthProp };

        Filter.outletNames.forEach((outletName) => {

          let staff;
          let dw;
          let trainee;

          if (!(Data[outletName][year] && Data[outletName][year][month])) {
            return;
          }
          
          const scope = Data[outletName][year][month];
          switch (Filter.dataType) {
            case "Jumlah Karyawan":
              staff = scope?.akhir?.staff;
              dw = scope?.akhir?.dw;
              trainee = scope?.akhir?.trainee;
              break;
            case "Leaver":
              staff = scope?.leaver?.staff;
              dw = scope?.leaver?.dw;
              trainee = scope?.leaver?.trainee;
              break;
            case "Voluntary Leaver":
              staff = scope?.voluntary?.staff;
              dw = scope?.voluntary?.dw;
              trainee = scope?.voluntary?.trainee;
              break;
            case "Involuntary Leaver":
              if (
                scope?.leaver?.staff != undefined &&
                scope?.voluntary?.staff != undefined
              ) {
                staff = scope.leaver.staff - scope.voluntary.staff;
              }
              if (
                scope?.leaver?.dw != undefined &&
                scope?.voluntary?.dw != undefined
              ) {
                dw = scope.leaver.dw - scope.voluntary.dw;
              }
              if (
                scope?.leaver?.trainee != undefined &&
                scope?.voluntary?.trainee != undefined
              ) {
                trainee = scope.leaver.trainee - scope.voluntary.trainee;
              }
              break;
            case "Turnover Rate":
              if (
                scope?.leaver?.staff != undefined &&
                scope?.akhir?.staff != undefined
              ) {
                staff = Number(
                  ((scope?.leaver?.staff / scope?.akhir?.staff) * 100).toFixed(
                    2
                  )
                );
              }
              if (
                scope?.leaver?.dw != undefined &&
                scope?.akhir?.dw != undefined
              ) {
                dw = Number(
                  ((scope?.leaver?.dw / scope?.akhir?.dw) * 100).toFixed(2)
                );
              }
              if (
                scope?.leaver?.trainee != undefined &&
                scope?.akhir?.trainee != undefined
              ) {
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
          if (typeof staff == "number") {
            monthlyStaff[outletName] = staff;
          }

          if (typeof dw == "number") {
            monthlyDw[outletName] = dw;
          }

          if (typeof trainee == "number") {
            monthlyTrainee[outletName] = trainee;
          }

          if (
            typeof staff == "number" ||
            typeof dw == "number" ||
            typeof trainee == "number"
          ) {
            monthlyAll[outletName] = (staff ?? 0) + (dw ?? 0) + (trainee ?? 0);
          }
        });
        mainOutput.push(monthlyAll);
        staffOutput.push(monthlyStaff);
        dwOutput.push(monthlyDw);
        traineeOutput.push(monthlyTrainee);
      }
    });
    // });
    setChartData({ mainOutput, staffOutput, dwOutput, traineeOutput });
  }, [dataLoading, isFilterReady, Filter, dataGroup]);

  return (
    <Box sx={{ display: "flex", gap: "1em", flexDirection: "column" }}>
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
  return data ? (
    <Box
      my={2}
      sx={{
        borderRadius: "16px",
        backgroundColor: "white",
        boxShadow: "3px 3px 12px 2px rgba(0,0,0,0.07)",
      }}
      pr={3}
      pt={2}
      pb={2}
    >
      <Typography
        variant="h6"
        component="h2"
        fontWeight={500}
        px="2em"
        pb="0.5em"
      >
        {title}
      </Typography>
      <LineChart width={750} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.8} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {yKeys.map((key) => (
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
  ) : (
    <Box
      my={2}
      sx={{
        borderRadius: "16px",
        backgroundColor: "white",
        boxShadow: "3px 3px 12px 2px rgba(0,0,0,0.07)",
      }}
      p={2}
    >
      <Typography
        variant="h6"
        component="h2"
        fontWeight={400}
        px="2em"
        py="1em"
      >
        <Skeleton />
      </Typography>
      <Skeleton height={200} width={700} variant="rectangular" />
    </Box>
  );
}
export default Chart;
