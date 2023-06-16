import axios from "axios";
import { useEffect, useRef, useState } from "react";
import App from "../App";
import { appendFileSync } from "fs";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import SpotifyPlayer from "./SpotifyPlayer";

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
  // do not leave as any.. return
  const [tracks, setTracks] = useState<any>([]);
  const [playlistToken, setPlaylistToken] = useState(null);
  // useRef so that we don't run axios requests twice
  const dataFetchedRef = useRef(false);

  const applyBpmRange = (moodValue: number | null) => {
    if (moodValue !== null) {
      switch (!!moodValue) {
        case moodValue <= 25:
          setBpmRange([0, 80]);
          setValence(0.2);
          break;
        case moodValue === 26:
          setBpmRange([91, 110]);
          setValence(0.65);
          break;
        case moodValue === 51:
          setBpmRange([111, 130]);
          setValence(0.8);
          break;
        case moodValue === 76:
          setBpmRange([131, 200]);
          setValence(1);
          break;
        default:
          // what do I want to do here?
          setBpmRange([]);
          break;
      }
    } else {
      console.log("No mood value");
      // alert the user to try again;
    }
  };

  const getPlaylists = async () => {
    try {
      await axios
        .get("http://localhost:80/recs/", {
          params: {
            seed_genres: genres.join(","),
            min_tempo: bpmRange[0],
            max_tempo: bpmRange[1],
            max_valence: valence,
          },
        })
        .then((tracks) => setTracks(tracks.data.playlist))
        .catch((error) => console.log(error));
    } catch (error) {
      // show something to the user if there is an error
      console.log(error);
    }
  };

  const createPlaylistId = async () => {
    const data = {
      playlistName,
      user_id: userId,
    };
    try {
      await axios
        .post("http://localhost:80/create_playlist_id", data)
        .then((result) => setPlaylistToken(result.data.id))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error, "error here");
    }
  };

  const createPlaylist = async () => {
    try {
      const data: Record<string, any> = {
        playlist_id: playlistToken,
        uris: tracks,
      };
      await axios
        .post("http://localhost:80/create_playlist", data)
        .then((result) => console.log(result, "result"))
        .catch((error) => console.log(error, "error"));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (dataFetchedRef.current) return;
      dataFetchedRef.current = true;
      await applyBpmRange(moodValue);
      // await createPlaylistId();
    })();
  }, []);

  useEffect(() => {
    if (bpmRange.length && valence !== null) {
      getPlaylists();
    }
  }, [valence]);

  useEffect(() => {
    if (playlistToken !== null && tracks.length) {
      createPlaylist();
    }
  }, [playlistToken, tracks]);

  return (
    <div>
      {tracks.length ? (
        <>
          <h1>Here's your Moody playlist!</h1>
          <SpotifyPlayer tracks={tracks} />
        </>
      ) : null}
    </div>
  );
};

export default Playlist;
