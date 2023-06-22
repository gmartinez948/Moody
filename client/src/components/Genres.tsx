import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Moods from "./Moods";
import axios from "axios";
import "../App.css";
import { motion } from "framer-motion";
import Alert from "@mui/material/Alert";

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
  const [genreCount, setGenreCount] = useState<number>(0);
  const [submitClicked, setSubmitClicked] = useState<boolean>(false);
  const [token, setToken] = useState<null | string>(null);
  const [userId, setUserId] = useState<null | string>(null);
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState("");

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

  const getAuthToken = async () => {
    return new Promise((resolve) => {
      resolve(
        axios.get("http://localhost:80/auth_token").then((response) => {
          setToken(response.data.token);
        })
      );
    });
  };

  const getUserInfo = useCallback(() => {
    return new Promise((resolve) => {
      resolve(
        axios
          .get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((userInfo) => {
            setUserId(userInfo.data.id);
          })
          .catch((error) => console.log(error.message))
      );
    });
  }, [token]);

  useEffect(() => {
    getAuthToken();
  }, []);

  useEffect(() => {
    if (token) {
      getUserInfo();
    }
  }, [token, getUserInfo]);

  const handlePlaylistChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPlaylistName(event.target.value);
  };

  const handlePlaylistFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (playlistName.trim() === "") {
      setError("Please enter a playlist name");
      return;
    }

    setError("");
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
                  key={genre}
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
            <>
              <h1>Now, name your playlist</h1>
              <form onSubmit={handlePlaylistFormSubmit}>
                <input type="text" onChange={handlePlaylistChange}></input>
                <motion.button whileHover={{ scale: 1.1 }} type="submit">
                  Submit
                </motion.button>
              </form>
              {error ? <Alert severity="error">{error}</Alert> : null}
            </>
          )}
        </>
      ) : (
        <Moods
          genres={selectedGenres}
          userId={userId}
          playlistName={playlistName}
        />
      )}
    </div>
  );
};

export default Genres;
