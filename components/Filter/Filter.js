import { Button } from "@mui/material";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {doc, getDoc} from "firebase/firestore"
import { db } from "../../lib/firebase"
import { useFilter } from "../../contexts/FilterContext";
import MonthRange from "./MonthRange";
import FilterCore from "./FilterCore";

export default function Filter({ filterProps }) {
  // outlet
  const [allOutletNames, setAllOutletNames] = useState([]);
  const [outletNames, setOutletNames] = useState([]);

  // employee type 
  const allEmployeeTypes = ["Staff", "Dw", "Training"];
  const [employeeTypes, setEmployeeTypes] = useState([
  "Staff",
    "Dw",
    "Training",
  ]);

  // date
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const {setFilter, filter} = useFilter();

  useEffect(() => {
    const getData = async () => {
      const q = await getDoc(doc(db, "metadata", "information"))
      if(q.exists) {
        setOutletNames(["SMG"])
        setAllOutletNames(q.data().outlet_names);
      }
    }
    getData();
  }, [])

  const submitFilter = () => {
    if(outletNames.length != 0 && employeeTypes.length != 0 && start && end) {
      setFilter({
        outletNames,
        employeeTypes,
        startMonth: start.month(),
        startYear: start.year(),
        endMonth: end.month(),
        endYear: end.year()
      })
      console.log(filter)
    } else {
      alert("Semua parameter harus terisi")
    }
  }

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
      <Button onClick={submitFilter} variant="contained">Filter</Button>
    </Box>
  );
}