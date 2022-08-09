import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../utils/firebase";

const DataContext = createContext({
  dataGroup: {
    /** @type{string[]} */
    OutletNames: [],
    /** @type{import("../utils/types").company} */
    Data: {},
  },
  dataError: null,
  dataLoading: true,
  setData: (state) => {},
});

function DataProvider({ children }) {
  const [data, setData] = useState({
    OutletNames: [],
    Data: {},
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "outlets"),
        (snapshot) => {
          setLoading(true);
          const outletNames = [];
          const data = {};
          snapshot.forEach((outlet) => {
            data[outlet.id] = outlet.data();
            outletNames.push(outlet.id);
          });
          setData({
            Data: data,
            OutletNames: outletNames,
          });
          setLoading(false);
        },
        (error) => {
          setLoading(true);
          setError({
            name: error.name,
            code: error.code,
            message: error.message,
          });
          setLoading(false);
        }
      ),
    []
  );

  return (
    <DataContext.Provider
      value={{
        dataGroup: data,
        setData,
        dataError: error,
        dataLoading: loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

function useData() {
  return useContext(DataContext);
}

export { DataProvider, useData };
