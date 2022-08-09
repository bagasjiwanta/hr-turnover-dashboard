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
    my={2}
      component="aside"
      spacing={2}
      sx={{
        width: 425,
        borderRadius: "16px",
        padding: "1em",
        backgroundColor:'white',
        boxShadow:"3px 3px 12px 2px rgba(0,0,0,0.07)"
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
          <Stack direction="row" justifyContent="flex-end" spacing={2} >
            <FilterCore
              selected={dataType}
              setSelected={setDataType}
              possibleValues={allDataType}
              label="data"
              multiple={false}
              width="80%"
            />
            <Button
              onClick={submitFilter}
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
