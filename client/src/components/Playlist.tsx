import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import SpotifyPlayer from "./SpotifyPlayer";
import RecommendedPlaylists from "./RecommendedPlaylists";
import { NoTracksFound } from "./NoTracksFound";
import { CircularProgress } from "@mui/material";

const Playlist = ({
  genres,
  moodValue,
  userId,
  playlistName,
}: {
  genres: string[];
  moodValue: number;
  userId: string | null;
  playlistName: string;
}) => {
  const [bpmRange, setBpmRange] = useState<never | number[]>([]);
  const [valence, setValence] = useState<null | number>(null);
  const [tracks, setTracks] = useState([]);
  const [danceability, setDanceability] = useState<null | number>(null);
  const [energy, setEnergy] = useState<null | number>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dataFetchedRef = useRef<boolean>(false);
  console.log(moodValue);

  function getRandomNumber(number: number) {
    const randomDecimal = Math.random();
    const randomNumber = randomDecimal * number;
    if (number === 1) {
      return randomNumber;
    } else {
      const finalNumber = Math.floor(randomNumber);
      return finalNumber;
    }
  }

  const applyBpmRange = (moodValue: number | null) => {
    if (moodValue !== null) {
      switch (!!moodValue) {
        case moodValue === 25:
          setBpmRange([50, 70]);
          setValence(0.2);
          setDanceability(0.2);
          setEnergy(0.2);
          break;
        case moodValue === 50:
          setBpmRange([90, 110]);
          setValence(0.5);
          setDanceability(0.4);
          setEnergy(0.4);
          break;
        case moodValue === 75:
          setBpmRange([111, 130]);
          setValence(0.7);
          setDanceability(0.7);
          setEnergy(0.7);
          break;
        case moodValue === 100:
          setBpmRange([131, 200]);
          setValence(1);
          setDanceability(1);
          setEnergy(1);
          break;
        default:
          // what do I want to do here?
          setBpmRange([getRandomNumber(200), getRandomNumber(200)]);
          setValence(getRandomNumber(1));
          setDanceability(getRandomNumber(1));
          setEnergy(getRandomNumber(1));
          setValence(getRandomNumber(1));
          break;
      }
    } else {
      console.log("No mood value");
      // alert the user to try again;
    }
  };

  const getPlaylists = useCallback(() => {
    axios
      .get("http://localhost:80/recs/", {
        params: {
          seed_genres: genres.join(","),
          target_tempo: bpmRange[1],
          target_valence: valence,
          target_danceability: danceability,
          target_energy: energy,
        },
      })
      .then((tracks) => {
        console.log(tracks.data);
        setTracks(tracks.data.playlist);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [bpmRange, genres, valence]);

  useEffect(() => {
    (async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      await applyBpmRange(moodValue);
      // await createPlaylistId();
    })();
  }, [moodValue]);

  useEffect(() => {
    if (bpmRange.length > 0 && valence !== null) {
      getPlaylists();
    }
  }, [valence, bpmRange, getPlaylists]);

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : tracks.length > 0 ? (
        <div>
          <SpotifyPlayer tracks={tracks} setTracks={setTracks} />
          <h2 className="Playlist-h2">
            Just incase, here are some recommended playlists!
          </h2>
          <RecommendedPlaylists />
        </div>
      ) : (
        <div>
          <NoTracksFound />
          <RecommendedPlaylists />
        </div>
      )}
    </div>
  );
};

export default Playlist;
