import { Button, MenuItem, Stack } from "@mui/material";
import { Checkbox } from "@mui/material";
import { OutlinedInput } from "@mui/material";
import { ListItemText } from "@mui/material";
import { InputLabel } from "@mui/material";
import { FormControl } from "@mui/material";
import { Box, Select } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {doc, getDoc} from "firebase/firestore"
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { db } from "../lib/firebase"

const STARTING_YEAR = 2020;

export default function Filter({ filterProps }) {
  const [allOutletNames, setAllOutletNames] = useState([]);
  const [outletNames, setOutletNames] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const q = await getDoc(doc(db, "metadata", "information"))
      if(q.exists) {
        setAllOutletNames([...q.data().outlet_names, "all"]);
      }
    }

    getData();
  }, [])

  const allEmployeeTypes = ["Staff", "Dw", "Training"];
  const [employeeTypes, setEmployeeTypes] = useState([
  "Staff",
    "Dw",
    "Training",
  ]);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  return (
    <Box sx={{display: 'flex', flexDirection: 'row', gap: '1em', alignItems:'flex-start'}}>
      <MonthRange 
        start={start}
        setStart={setStart}
        end={end}
        setEnd={setEnd}
      />
      <FilterCore
        selected={employeeTypes}
        setSelected={setEmployeeTypes}
        possibleValues={allEmployeeTypes}
        label="Tipe Karyawan"
      />
      <FilterCore 
        possibleValues={allOutletNames}
        selected={outletNames}
        setSelected={setOutletNames}
        label="Outlet"
        width={300}
      />
      <Button onClick={() => alert("yeah")} variant="contained">Filter</Button>
    </Box>
  );
}

const MINIMUM_MONTH = "01/2020";
const MAXIMUM_MONTH = new Date().getMonth().toString() + "/" + new Date().getFullYear().toString();

function MonthRange({start, setStart, end, setEnd}) {
  useEffect(() => {
    dayjs.extend(customParseFormat);
  }, []);

  const [minMonth, setMinMonth] = useState(MINIMUM_MONTH);

  useEffect(() => {
    if(start) {
      setMinMonth(start);
    } else {
      setMinMonth(MINIMUM_MONTH)
    }
  }, [start])

  return (
    <Stack spacing={1} sx={{width:200}}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Dari"
          inputFormat="MM/YYYY"
          value={start}
          onChange={(newStart) => {
            setStart(newStart);
          }}
          minDate={dayjs(MINIMUM_MONTH, "MM/YYYY")}
          maxDate={dayjs(MAXIMUM_MONTH, "M/YYYY")}
          renderInput={(params) => <TextField {...params} />}
          views={["month", "year"]}
        />
        <DatePicker
          label="Sampai"
          inputFormat="MM/YYYY"
          value={end}
          onChange={(newEnd) => {
            setEnd(newEnd);
          }}
          minDate={minMonth}
          maxDate={dayjs(MAXIMUM_MONTH, "M/YYYY")}
          renderInput={(params) => <TextField {...params} />}
          views={["month", "year"]}
        />
      </LocalizationProvider>
    </Stack>
  );
}

function FilterCore({
  possibleValues,
  selected,
  setSelected,
  width = 200,
  label,
}) {
  const handleYearChange = (e) => {
    const {
      target: { value },
    } = e;
    if (typeof value == "string") {
      if (value != "") {
        setSelected(value.split(","));
      }
    } else {
      if (value.length != 0) {
        setSelected(value);
      }
    }
  };
  return (
    <FormControl sx={{ width: width }}>
      <InputLabel id={`select-${label}-label`}>{label}</InputLabel>
      <Select
        id={`select-${label}`}
        labelId={`select-${label}-label`}
        multiple
        value={selected}
        onChange={handleYearChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(", ")}
      >
        {possibleValues.map((y) => (
          <MenuItem value={y} key={y}>
            <Checkbox checked={selected.indexOf(y) > -1} />
            <ListItemText primary={y} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
