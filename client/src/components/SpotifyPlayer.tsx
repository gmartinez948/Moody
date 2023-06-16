import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { getAuthToken } from "../hooks/getAuthToken";
import "../App.css";

import {
  WebPlaybackSDK,
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";

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

  const SongDetails: React.FC = () => {
    const playbackState = usePlaybackState();

    if (playbackState === null) return null;

    const transformArtistNames = () => {
      return playbackState.track_window.current_track.artists
        .map((artist) => artist.name)
        .join(", ");
    };

    return (
      <div className="Song-Card-Text">
        <img
          src={playbackState.track_window.current_track.album.images[0].url}
        />
        <p>Current song: {playbackState.track_window.current_track.name}</p>
        <p>Artist: {transformArtistNames()}</p>
      </div>
    );
  };

  const PlayTracks = () => {
    const device = usePlayerDevice();
    const player = useSpotifyPlayer();

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

    const playNext = () => {
      if (device === null) return;
      axios({
        method: "post",
        url: "https://api.spotify.com/v1/me/player/next",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        params: {
          device_id: device.device_id,
        },
      })
        .then((response) => {
          console.log("Playback moved to the next track");
        })
        .catch((error) => {
          console.error("Error moving to the next track:", error.response.data);
        });
    };

    const playPrevious = () => {
      if (device === null) return;

      axios({
        method: "post",
        url: "https://api.spotify.com/v1/me/player/previous",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        params: {
          device_id: device.device_id,
        },
      })
        .then((response) => {
          console.log("Playback moved to the next track");
        })
        .catch((error) => {
          console.error("Error moving to the next track:", error.response.data);
        });
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
        <button onClick={() => playPrevious()}>Play Previous</button>
        <button onClick={() => playNext()}>Play Next</button>
      </div>
    );
  };

  return (
    <WebPlaybackSDK
      initialDeviceName="Moody app"
      getOAuthToken={getOAuthToken}
      initialVolume={0.5}
      connectOnInitialized={true}
    >
      <div className="Song-Card-Container">
        <SongDetails />
        <PlayTracks />
      </div>
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayer;
