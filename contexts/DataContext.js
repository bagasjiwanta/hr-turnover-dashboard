import { collection, getDocs } from "firebase/firestore";
import { createContext, useContext, useState } from "react";
import { db } from "../lib/firebase"

const DataContext = createContext({
  data: {
    outlet_data: {},
    serial_data: {},
    outlet_names: [],
  },
});

function DataProvider({ children }) {
  const [data, setData] = useState(null);
  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  return useContext(DataContext);
}

async function getAllData() {
  const years = [2020, 2021, 2022, 2023];
  let data = {
    serial_data: {},
    outlet_data: {},
    outlet_names: [],
  };
  let { outlet_data, serial_data } = data;
  for (let a of years) {
    try {
      const q = await getDocs(collection(db, a.toString()));
      q.forEach((outlet) => {
        if (!Object.keys(serial_data).find((v) => v == a)) {
          serial_data[a] = {};
        }
        serial_data[a][outlet.id] = outlet.data();

        if (!Object.keys(outlet_data).find((v) => v == outlet.id)) {
          outlet_data[outlet.id] = { ...outlet.data() };
        } else {
          outlet_data[outlet.id]["data"].push(...outlet.data().data);
        }
      });
    } catch (err) {
      if (err.code) {
        if (err.code == "invalid-argument") {
          break;
        }
      }
    }
  }
  data["outlet_names"] = Object.keys(outlet_data);
  return data;
}

export { DataProvider, useData, getAllData };
