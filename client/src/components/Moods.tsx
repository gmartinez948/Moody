import "../App.css";
import Playlist from "./Playlist";
import { Slider, ThemeProvider, createTheme } from "@mui/material";
import { useState } from "react";

const marks = [
  {
    value: 25,
    label: "Sad",
  },
  {
    value: 50,
    label: "Calm",
  },
  {
    value: 75,
    label: "Happy",
  },
  {
    value: 100,
    label: "Energetic",
  },
];

const theme = createTheme({
  components: {
    MuiSlider: {
      styleOverrides: {
        thumb: {
          color: "white",
        },
        track: {
          color: "orange",
        },
        rail: {
          color: "gray",
        },
        markLabel: {
          color: "white",
        },
        root: {
          width: "75%",
        },
      },
    },
  },
});

const valuetext = (value: number) => {
  return `${value}`;
};

const Moods = ({
  genres,
  userId,
  playlistName,
}: {
  genres: string[];
  userId: string | null;
  playlistName: string;
}) => {
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    event.preventDefault();
    if (typeof newValue === "number") {
      if (newValue === 125) {
        setSliderValue(100);
      } else {
        setSliderValue(newValue);
      }
    }
  };

  return (
    <div className="Mood-Slider-Box">
      {!submitClicked ? (
        <>
          <h1>What's your mood?</h1>
          <ThemeProvider theme={theme}>
            <Slider
              aria-label="Custom marks"
              defaultValue={0}
              getAriaValueText={valuetext}
              step={25}
              valueLabelDisplay="off"
              marks={marks}
              min={0}
              max={125}
              onChange={handleSliderChange}
            />
          </ThemeProvider>
          {sliderValue > 0 && (
            <button onClick={() => setSubmitClicked(true)}>Submit mood</button>
          )}
        </>
      ) : (
        <Playlist
          genres={genres}
          moodValue={sliderValue}
          userId={userId}
          playlistName={playlistName}
        />
      )}
    </div>
  );
};

export default Moods;
