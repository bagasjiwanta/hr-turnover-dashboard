import { Button, Skeleton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { defaultFilterValue, useFilter } from "../../contexts/FilterContext";
import MonthRange from "./MonthRange";
import FilterCore from "./FilterCore";
import { useData } from "../../contexts/DataContext";
import dayjs from "dayjs";

const allDataType = [
  "Jumlah Karyawan",
  "Leaver",
  "Voluntary Leaver",
  "Involuntary Leaver",
  "Turnover Rate",
];

export default function Filter() {
  const { setFilter, Filter, isFilterReady } = useFilter();
  const {
    dataGroup: { Data, OutletNames },
    dataLoading,
  } = useData();
  const [allOutletNames, setAllOutletNames] = useState([]);
  const [outletNames, setOutletNames] = useState([]);
  const [start, setStart] = useState(
    dayjs("01/" + dayjs().year().toString(), "MM/YYYY")
  );
  const [end, setEnd] = useState(dayjs());
  const [dataType, setDataType] = useState(Filter.dataType);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFilterReady) {
      setLoading(true);
      setAllOutletNames(OutletNames);
      setOutletNames(Filter.outletNames);
      setLoading(false);
    }
  }, [OutletNames, isFilterReady, Filter.outletNames]);

  const submitFilter = () => {
    if (outletNames.length != 0 && start && end) {
      setFilter({
        outletNames,
        startMonth: start.month(),
        startYear: start.year(),
        endMonth: end.month(),
        endYear: end.year(),
        dataType,
      });
    } else {
      alert("Semua parameter harus terisi");
    }
  };

  return (
    <Stack
      component="aside"
      spacing={2}
      sx={{
        width: 425,
        border: "1px solid #D3D3D3",
        borderRadius: "5px",
        padding: "1em",
      }}
    >
      <Typography variant="h5">Filter</Typography>

      {loading ? (
        <Skeleton />
      ) : (
        <>
          {/* monthRange */}
          <MonthRange
            start={start}
            setStart={setStart}
            end={end}
            setEnd={setEnd}
          />
          {/* outletNames */}
          <FilterCore
            possibleValues={allOutletNames}
            selected={outletNames}
            setSelected={setOutletNames}
            label="Outlet"
          />
          {/* dataType & button */}
          <Stack direction="row" spacing={2}>
            <FilterCore
              selected={dataType}
              setSelected={setDataType}
              possibleValues={allDataType}
              label="data"
              multiple={false}
            />
            <Button
              onClick={submitFilter}
              sx={{ width: 200 }}
              variant="contained"
            >
              Apply
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
}
