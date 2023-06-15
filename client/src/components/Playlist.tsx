import axios from "axios";
import { useEffect, useState } from "react";
import App from "../App";
import { appendFileSync } from "fs";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { SkipPrevious, PlayArrow, SkipNext } from "@mui/icons-material";

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
      // this is not hitting;;
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
        uris: tracks.map((track: any) => track.uri),
      };
      await axios
        .post("http://localhost:80/create_playlist", data)
        .then((result) => console.log(result, "result"))
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    applyBpmRange(moodValue);
  }, []);

  useEffect(() => {
    const getAll = async () => {
      try {
        if (bpmRange.length && valence !== null) {
          await getPlaylists();
        }
        await createPlaylistId();
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

  return (
    <div>
      {tracks.length ? (
        <>
          <h1>Here's your Moody playlist!</h1>
          {tracks.map((song: any) => {
            return (
              <Card sx={{ display: "flex" }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="div" variant="h5">
                      {song.name}
                    </Typography>
                    {song.artists.map((artist: any) => {
                      return (
                        <Typography
                          variant="subtitle1"
                          color="text.secondary"
                          component="div"
                        >
                          {artist.name}
                        </Typography>
                      );
                    })}
                  </CardContent>
                  <Box
                    sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
                  >
                    {/* <IconButton aria-label="previous">
                    {theme.direction === "rtl" ? <SkipNext /> : <SkipPrevious />}
                  </IconButton> */}
                    {/* <IconButton aria-label="play/pause">
                      <PlayArrow />
                    </IconButton> */}
                    {/* <IconButton aria-label="next">
                    {theme.direction === "rtl" ? <SkipPrevious /> : <SkipNext />}
                  </IconButton> */}
                  </Box>
                </Box>
                <CardMedia
                  component="img"
                  sx={{ width: 151 }}
                  image={song.album.images[0].url}
                  alt="Live from space album cover"
                />
                <CardMedia component="audio" controls src={song.preview_url} />
              </Card>
            );
          })}
        </>
      ) : (
        <Box sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
    </div>
  );
};

export default Playlist;
