import React, { useEffect, useState } from "react";
import Moods from "./Moods";
import axios from "axios";
import { getAuthToken, getTrack } from "../hooks/getAuthToken";
import "../App.css";
import { motion } from "framer-motion";

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

const Genres = () => {
  const [selectedGenres, setSelectedGenres] = useState<never | string[]>([]);
  const [genreCount, setGenreCount] = useState(0);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [token, setToken] = useState(getAuthToken());

  const handleGenreClick = (genre: string) => {
    // the genre count continues to increase somehow.. fix this. // update: this is fixed with the conditional rendering below, but still smelly code
    if (genreCount < 5 && !selectedGenres.includes(genre.toLowerCase())) {
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
  // using the genre count, if it is greater than 5, I will pass along the selected genres to a component and make the api call to get recom

  // add a submit button

  const onSubmit = () => {
    setSubmitClicked(true);
  };

  return (
    <div className="genre-page-container">
      {genreCount < 5 && !submitClicked ? (
        <>
          <h1>
            First, let's get to know your taste in genres
            <br />
            Choose up to 5
          </h1>
          <div className="genre-bubble-container">
            {genres.map((genre) => {
              return (
                <motion.button
                  style={{
                    backgroundColor: "#ff7f00",
                    border: selectedGenres.includes(genre.toLowerCase())
                      ? "5px solid white"
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
          {genreCount > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onSubmit()}
            >
              Submit
            </motion.button>
          )}
        </>
      ) : (
        <Moods genres={selectedGenres} />
      )}
    </div>
  );
};

export default Genres;
