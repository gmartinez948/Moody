import axios from "axios";
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getAuthToken } from "../hooks/getAuthToken";
import "../App.css";
import CircularProgress from "@mui/material/CircularProgress";

import {
  WebPlaybackSDK,
  useErrorState,
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import { ClassNames } from "@emotion/react";

const SpotifyPlayer = ({ tracks, setTracks }: any) => {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const authToken = async () => {
      try {
        const token = await getAuthToken();
        setToken(token as string);
      } catch (error) {
        console.log(error);
      }
    };
    authToken();
  }, []);

  const getOAuthToken = useCallback((callback: any) => callback(token), [
    token,
  ]);

  const PlayTracks = ({
    index,
    playTrack,
    setTracks,
    currentSong,
  }: {
    index: number;
    playTrack: (index?: number) => void;
    setTracks: SetStateAction<any>;
    currentSong: any;
  }) => {
    const player = useSpotifyPlayer();
    const [playClicked, setPlayClicked] = useState(false);

    if (player === null) return null;

    const handlePlayClicked = (index: number) => {
      playTrack(index);
      setPlayClicked(true);
    };

    const handlePlayPauseClicked = (index: number) => {
      if (playClicked) {
        player.pause();
        setPlayClicked(false);
      } else {
        playTrack(index);
        setPlayClicked(true);
      }
    };

    return (
      <div className="Current-Song-Buttons">
        <button onClick={() => handlePlayPauseClicked(index)}>
          {currentSong && !playClicked ? "Play" : "Pause"}
        </button>
      </div>
    );
  };

  const SongDetails = ({ tracks, setTracks }: any) => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady();
    const device = usePlayerDevice();

    const player = useSpotifyPlayer();
    const [currentSong, setCurrentSong] = useState<any>(tracks[0]);

    const playTrack = (index = 0) => {
      // says when there is no internet connection, null is returned.  WEIRD
      if (device === null)
        return <>please return to Spotify and configure settings</>;
      if (tracks[index] === undefined) {
        return;
      }
      const mappedUris = tracks.map((track: any) => track.uri);
      fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [mappedUris[index]] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setting the current song so I can apply styles to the current song later.
      setCurrentSong(tracks[index]);
    };

    // handle slight delay for the usePlayerDevice hook to connect to the SDK

    if (!webPlaybackSDKReady || !tracks.length) return <CircularProgress />;

    const transformArtistNames = (album: any) => {
      return album.artists.map((artist: any) => artist.name).join(", ");
    };

    return (
      <div>
        {tracks.map((track: any, index: number) => {
          return (
            <div className={track === currentSong ? "Current-Song" : "Song"}>
              <img src={track.album.images[0].url} width="75" />
              <div className="Current-Text">
                <p>{track.name}</p>
                <p>{transformArtistNames(track.album)}</p>
                <div className="Current-Song-Buttons">
                  <PlayTracks
                    index={index}
                    playTrack={playTrack}
                    setTracks={setTracks}
                    currentSong={currentSong}
                  />
                </div>
              </div>
            </div>
          );
        })}
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
        <SongDetails tracks={tracks} setTracks={setTracks} />
      </div>
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayer;
