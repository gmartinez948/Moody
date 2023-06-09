import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import axios from "axios";
import { getAuthToken, getTrack } from "../hooks/getAuthToken";
import { useEffect, useMemo, useState } from "react";
import "../App.css";
import { motion, useAnimation } from "framer-motion";
import { useRef } from "react";

const genres: string[] = [
  "Pop",
  "Hip-Hop",
  "Rock",
  "R&B/Soul",
  "Indie",
  "Electronic/Dance",
  "Alternative",
  "Country",
  "Reggae",
  "Jazz",
  "Classical",
  "Folk",
  "Metal",
  "Punk",
  "Latin",
  "K-Pop",
  "Blues",
  "Funk",
  "Gospel",
  "World",
];

const colors = [
  "#D86F68", // terracota pink
  "#E97451", // gold
  "#FFDB58", // mustard
  "#556B2F", // papaya
  "#B7410E", // rust
  "#FFBF00", // amber
  "#E2725B", // peach,
  "#FFDB58", // coral
];

const Moods = () => {
  const [selectedGenres, setSelectedGenres] = useState<never | string[]>([]);
  const [genreCount, setGenreCount] = useState(0);
  const [buttonBorder, setButtonBorder] = useState("none");

  const handleGenreClick = (genre: string) => {
    if (!selectedGenres.includes(genre.toLowerCase()) && genreCount < 5) {
      let copyOfSelectedGenres = [...selectedGenres];
      copyOfSelectedGenres.push(genre.toLowerCase());
      setSelectedGenres(copyOfSelectedGenres);
      setGenreCount((prev) => prev + 1);
    } else {
      setSelectedGenres(
        selectedGenres.filter(
          (g) => g.toLocaleLowerCase() !== genre.toLowerCase()
        )
      );
      if (genreCount > 0) {
        setGenreCount((prev) => prev - 1);
      }
    }
  };

  const getRelatedArtists = () => {
    axios
      .get("http://localhost:80/recs/")
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => console.log(error));
  };
  const getRecommendations = () => {
    axios
      .get("http://localhost:80/recommendations/")
      .then(({ data }) => console.log(data.tracks))
      .catch((error) => console.log(error));
  };
  const getRandomColor = (colors: string[]) => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  console.log(genreCount, "count");

  console.log(`${Math.floor(Math.random() * colors.length)}`);

  return (
    <div className="genre-page-container">
      <h1>
        Let's get to know your taste
        <br />
        Choose 5 genres
      </h1>
      <div className="genre-bubble-container">
        {genres.map((genre) => {
          return (
            <motion.button
              style={{
                backgroundColor: `${getRandomColor(colors)}`,
                border: selectedGenres.includes(genre.toLowerCase())
                  ? "5px solid #00FF00"
                  : "none",
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleGenreClick(genre)}
            >
              {genre}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Moods;
