import { createContext, useContext, useState } from "react"

const FilterContext = createContext(null) 

function useFilter() {
  return useContext(FilterContext);
}

export default function FilterProvider({children}) {
  const [filter, setFilter] = useState({
    outletNames: ["SMG"],
    employeeTypes: ["Staff", "Dw", "Training"],
    startMonth: 1,
    startYear: 2020,
    endMonth: 6,
    endYear: 2022
  });

  return (
    <FilterContext.Provider value={{ filter, setFilter }}> 
      {children}
    </FilterContext.Provider>
  )
}

export {
  useFilter, FilterProvider
}