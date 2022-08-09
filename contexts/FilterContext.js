import dayjs from "dayjs";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { useData } from "./DataContext";

/** @type{import("../utils/types").Filter} */
const defaultFilterValue = {
  outletNames: [],
  startMonth: 1,
  startYear: dayjs().year(),
  endMonth: dayjs().month(),
  endYear: dayjs().year(),
  dataType: "Jumlah Karyawan",
};

const FilterContext = createContext({
  Filter: defaultFilterValue,
  setFilter: (newFilter) => {},
  isFilterReady: false,
});

function useFilter() {
  return useContext(FilterContext);
}

function FilterProvider({ children }) {
  const [filter, setFilter] = useState(defaultFilterValue);
  const {
    dataGroup: { OutletNames },
    dataLoading,
  } = useData();
  const [isFilterReady, setIsFilterReady] = useState(false);
  useEffect(() => {
    if (!dataLoading) {
      setIsFilterReady(false);
      if (OutletNames.find((v) => v == "SMG")) {
        setFilter({ ...filter, outletNames: ["SMG"] });
      } else {
        setFilter({ ...filter, outletNames: [OutletNames[0]] });
      }
      setIsFilterReady(true);
    }
  }, [dataLoading]);
  return (
    <FilterContext.Provider
      value={{ Filter: filter, setFilter, isFilterReady }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export { useFilter, FilterProvider, defaultFilterValue };
