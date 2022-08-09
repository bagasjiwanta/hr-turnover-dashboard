import { Box, Button } from "@mui/material";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Chart from "../components/Chart/Chart";
import Filter from "../components/Filter/Filter";
import { db } from "../utils/firebase";
import jsondata from "../contexts/data.json";

/** @type {import("next").NextPage} */
export default function Home() {
  return (
    <Box
      component="main"
      mx="1em"
      mt="5em"
      sx={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        justifyContent: "space-between",
        backgroundColor: "rgb(250,250,250)",
      }}
    >
      <Box>
        <Chart />
      </Box>
      <Filter />
    </Box>
  );
}
