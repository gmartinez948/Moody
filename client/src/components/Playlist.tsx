import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import SpotifyPlayer from "./SpotifyPlayer";
import RecommendedPlaylists from "./RecommendedPlaylists";
import { NoTracksFound } from "./NoTracksFound";

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
  const [tracks, setTracks] = useState<Array<Record<string, any>>>([]);
  const [playlistToken, setPlaylistToken] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // useRef so that we don't run axios requests twice
  const dataFetchedRef = useRef<boolean>(false);

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

  const getPlaylists = useCallback(() => {
    axios
      .get("http://localhost:80/recs/", {
        params: {
          seed_genres: genres.join(","),
          min_tempo: bpmRange[0],
          max_tempo: bpmRange[1],
          max_valence: valence,
        },
      })
      .then((tracks) => setTracks(tracks.data.playlist))
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      })
      .finally(() => setIsLoading(false));
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
      {!isLoading && tracks.length > 0 && (
        <>
          <h1 className="Playlist-Header">Here's your Moody playlist!</h1>
          <SpotifyPlayer tracks={tracks} setTracks={setTracks} />
          <h2 className="Playlist-h2">Here are some recommended playlists!</h2>
          <RecommendedPlaylists />
        </>
      )}
      {!isLoading && tracks.length === 0 && (
        <div>
          <NoTracksFound />
          <RecommendedPlaylists />
        </div>
      )}
    </div>
  );
};

export default Playlist;
