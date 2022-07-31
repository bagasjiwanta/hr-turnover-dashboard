import { Box } from "@mui/material";
import { useEffect } from "react";
import Chart from "../components/Chart";
import Filter from "../components/Filter/Filter";
import { DataProvider, useData } from "../contexts/DataContext";
import FilterProvider from "../contexts/FilterContext";

/** @type {import("next").GetStaticProps} */
export async function getStaticProps() {
  try {
    // const result = await getAllData();
    const result = {};
    return {
      props: {
        rawData: result,
      },
    };
  } catch (err) {
    return {
      props: {
        error: err.toString(),
      },
    };
  }
}

/** @type {import("next").NextPage} */
export default function Home({ rawData, error }) {
  const { data, setData } = useData();
  useEffect(() => {
    if (!data) {
      if (!error) {
        setData(rawData);
        console.log(rawData);
      } else {
        alert("Oops an error happened. Please try again later");
        console.log(error);
      }
    }
  }, []);
  return (
    <Box component="main" mt="5em">
      <DataProvider>
        <FilterProvider>

        <Filter />
        <Chart />
        </FilterProvider>
      </DataProvider>
    </Box>
  );
}
