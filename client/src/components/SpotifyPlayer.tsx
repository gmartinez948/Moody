import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "../hooks/getAuthToken";

import {
  WebPlaybackSDK,
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import SongCard from "./SongCard";

const AUTH_TOKEN = "your token here!";

const SpotifyPlayer = ({ tracks }: any) => {
  const [token, setToken] = useState(null);
  const [currentSong, setCurrentSong] = useState({});
  const mappedUris = tracks.map((track: any) => track.uri);

  useEffect(() => {
    const authToken = async () => {
      try {
        const token = await getAuthToken();
        setToken(token as any);
      } catch (error) {
        console.log(error);
      }
    };
    authToken();
  }, []);

  const getOAuthToken = useCallback((callback: any) => callback(token), [
    token,
  ]);

  const SongTitle: React.FC = () => {
    const playbackState = usePlaybackState();

    if (playbackState === null) return null;

    return <p>Current song: {playbackState.track_window.current_track.name}</p>;
  };

  const PauseResumeButton = () => {
    const player = useSpotifyPlayer();
    // console.log(player);

    if (player === null) return null;

    return (
      <div>
        <button onClick={() => player.pause()}>pause</button>
        <button onClick={() => player.resume()}>resume</button>
      </div>
    );
  };

  const PlayTracks = () => {
    const device = usePlayerDevice();
    const player = useSpotifyPlayer();
    const [isPaused, setIsPaused] = useState(false);
    const [playButtonClicked, setPlayButtonClicked] = useState(false);

    const playTracks = () => {
      const mappedUris = tracks.map((track: any) => track.uri);
      if (device !== null) {
        fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
          {
            method: "PUT",
            body: JSON.stringify({ uris: mappedUris }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      return;
    };

    useEffect(() => {
      if (device) {
        playTracks();
      }
    }, [device]);
    if (player === null) return null;

    return (
      <div>
        <button onClick={() => player.pause()}>pause</button>
        <button onClick={() => player.resume()}>resume</button>
      </div>
    );

    // return (
    //   <button onClick={() => playTracks()}>
    //     {!isPaused ? "Play" : "Pause"}
    //   </button>
    // );
  };

  return (
    <WebPlaybackSDK
      initialDeviceName="Moody app"
      getOAuthToken={getOAuthToken}
      initialVolume={0.5}
      connectOnInitialized={true}
    >
      {/* `TogglePlay` and `SongTitle` will be defined later. */}
      <SongTitle />
      <PlayTracks />
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayer;
