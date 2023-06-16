import { useStartAndResumePlayer } from "../hooks/player";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useInstantTransition } from "framer-motion";
import { useEffect, useState } from "react";
import {
  usePlayerDevice,
  useSpotifyPlayer,
  usePlaybackState,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";

interface SongCardProps {
  name: string;
  artists: string;
  img: string;
}

const SongCard = ({ token, tracks }: any) => {
  const [isPaused, setIsPaused] = useState(false);
  const player = useSpotifyPlayer();
  const playbackState = usePlaybackState();
  const device = usePlayerDevice();
  const webPlaybackSDKReady = useWebPlaybackSDKReady();
  console.log(player, "player");
  console.log(playbackState, "Playback state");
  console.log(device, "device");
  const mappedUris = tracks.map((track: any) => track.uri);

  // const fetchSongTrackWindow = () => {
  //   if (device === null) return;
  //   fetch(
  //     `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
  //     {
  //       method: "PUT",
  //       body: JSON.stringify({ uris: mappedUris }),
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //   )
  //     .then((result) => console.log(result))
  //     .catch((error) => console.log(error));
  // };

  const playSongs = () => {
    if (device === null) return;
    const mappedUris = tracks.map((track: any) => track.uri);
    axios
      .put(
        `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
        {
          data: JSON.stringify({ uris: mappedUris }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    playSongs();
  }, [device]);

  const pauseAndResumePlayer = () => {
    if (!isPaused) {
      player?.pause();
      setIsPaused(true);
    }
    player?.resume();
    setIsPaused(false);
  };
  if (!webPlaybackSDKReady) return <div>Loading...</div>;

  if (player === null) return null;

  return (
    <button aria-label="play/pause">
      {playbackState?.track_window.current_track.name}
    </button>
  );
};

export default SongCard;
