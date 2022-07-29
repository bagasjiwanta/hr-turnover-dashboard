import { Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import {
  LineChart,
  CartesianGrid,
  YAxis,
  XAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts";

function Chart() {
  return (
    <Box>
      <LineChart
        width={730}
        height={250}
        data={dummy_data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="outlet1"
          stroke="#8884d8"
          animationEasing="ease-out"
          unit="%"
        />
        <Line
          type="monotone"
          dataKey="outlet2"
          stroke="#82ca9d"
          animationEasing="ease-out"
          unit="%"
        />
        <Line
          type="monotone"
          dataKey="outlet3"
          stroke="#fcba03"
          animationEasing="ease-out"
          unit="%"
        />
      </LineChart>
    </Box>
  );
}

const dummy_data = [
  {
    month: "January 2020",
    outlet1: 10,
    outlet2: 3,
    outlet3: 2,
  },
  {
    month: "February 2020",
    outlet1: 18,
    outlet2: 2,
    outlet3: 1,
  },
  {
    month: "March 2020",
    outlet1: 9,
    outlet2: 5,
    outlet3: 3,
  },
  {
    month: "April 2020",
    outlet1: 7,
    outlet2: 4,
    outlet3: 1,
  },
  {
    month: "May 2020",
    outlet1: 5,
    outlet2: 4,
    outlet3: 0,
  },
];

export default Chart;
