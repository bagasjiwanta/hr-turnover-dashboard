import { Stack, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { EARLIEST_MONTH, LATEST_MONTH } from "../../utils/constants";
import { useState, useEffect } from "react";

export default function MonthRange({ start, setStart, end, setEnd }) {
  useEffect(() => {
    dayjs.extend(customParseFormat);
  }, []);

  const [minMonth, setMinMonth] = useState(EARLIEST_MONTH);
  const [maxMonth, setMaxMonth] = useState(LATEST_MONTH);

  useEffect(() => {
    if (start) {
      setMinMonth(start);
    } else {
      setMinMonth(EARLIEST_MONTH);
    }
  }, [start]);

  useEffect(() => {
    if (end) {
      setMaxMonth(end);
    } else {
      setMaxMonth(LATEST_MONTH);
    }
  }, [end]);

  return (
    <Stack direction="row" spacing={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Dari"
          inputFormat="MM/YYYY"
          value={start}
          onChange={(newStart) => {
            setStart(newStart);
          }}
          minDate={EARLIEST_MONTH}
          maxDate={maxMonth}
          renderInput={(params) => <TextField {...params} />}
          views={["year", "month"]}
        />
        <DatePicker
          label="Sampai"
          inputFormat="MM/YYYY"
          value={end}
          onChange={(newEnd) => {
            setEnd(newEnd);
          }}
          minDate={minMonth}
          maxDate={LATEST_MONTH}
          renderInput={(params) => <TextField {...params} />}
          views={["year", "month"]}
        />
      </LocalizationProvider>
    </Stack>
  );
}
