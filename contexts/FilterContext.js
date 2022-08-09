import dayjs from "dayjs";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../utils/firebase";

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
  isReady: false,
});

function useFilter() {
  return useContext(FilterContext);
}

function FilterProvider({ children }) {
  const [filter, setFilter] = useState(defaultFilterValue);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const q = await getDoc(doc(db, "metadata", "information"));
      if (q.exists()) {
        const { outlet_names } = q.data();
        if (outlet_names.find((v) => v == "SMG")) {
          setFilter({
            ...defaultFilterValue,
            outletNames: ["SMG"],
          });
        } else {
          setFilter({
            ...defaultFilterValue,
            outletNames: [outlet_names.at(0)],
          });
        }
      }
      setIsReady(true);
    };
    getData();
  }, []);

  return (
    <FilterContext.Provider value={{ Filter: filter, setFilter, isReady }}>
      {children}
    </FilterContext.Provider>
  );
}

export { useFilter, FilterProvider, defaultFilterValue };
