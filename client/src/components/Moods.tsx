import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import axios from "axios";
import { getAuthToken, getTrack } from "../hooks/getAuthToken";

const marks = [
  {
    value: 0,
    label: "SAD",
  },
  {
    value: 25,
    label: "20°C",
  },
  {
    value: 50,
    label: "Whatever",
  },
  {
    value: 75,
    label: "Happy",
  },
];

const Moods = () => {
  React.useEffect(() => {}, []);
  return (
    <Box sx={{ width: 300, margin: "20%" }}>
      <Slider
        aria-label="Custom marks"
        defaultValue={50}
        step={25}
        marks={marks}
      />
    </Box>
  );
};

export default Moods;
