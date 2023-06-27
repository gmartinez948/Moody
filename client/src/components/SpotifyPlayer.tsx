import { SetStateAction, useCallback, useEffect, useState } from "react";
import { getAuthToken } from "../hooks/getAuthToken";
import "../App.css";
import CircularProgress from "@mui/material/CircularProgress";
import {
  WebPlaybackSDK,
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import { ErrorPage } from "./ErrorPage";
import { NoTracksFound } from "./NoTracksFound";
import { getDevices } from "../hooks/getDevices";
import { fetchTrack } from "../hooks/fetchTrack";
import { Devices } from "./Devices";

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

    const handlePlayPauseClicked = (index: number) => {
      if (playClicked && tracks[index] === currentSong) {
        player.pause().then(() => setPlayClicked(false));
      } else {
        playTrack(index);
        setPlayClicked(true);
      }
    };

    return (
      <div className="Current-Song-Buttons">
        <button onClick={() => handlePlayPauseClicked(index)}>
          {currentSong !== tracks[index] || !playClicked ? "Play" : "Pause"}
        </button>
      </div>
    );
  };

  const SongDetails = ({ tracks, setTracks }: any) => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady();
    const device = usePlayerDevice();
    const [currentSong, setCurrentSong] = useState<any>(tracks[0]);
    const [devices, setDevices] = useState([]);

    useEffect(() => {
      if (token) {
        getDevices(token, setDevices);
      }
    }, []);

    const checkForDevices = () => {
      if (devices.length > 0 && device === null) {
        return <Devices devices={devices} token={token} />;
      }
      if (!devices.length) {
        return <ErrorPage />;
      }
    };

    useEffect(() => {
      checkForDevices();
    }, [devices]);

    console.log(devices);

    const playTrack = (index = 0) => {
      console.log(device, "device");
      if (tracks[index] === undefined) {
        return;
      }
      const mappedUris = tracks.map((track: any) => track.uri);
      if (token && device) {
        fetchTrack(mappedUris, index, token, device);
      }
      setCurrentSong(tracks[index]);
    };

    if (!tracks.length) {
      return <NoTracksFound />;
    }

    if (!webPlaybackSDKReady) return <CircularProgress />;

    const transformArtistNames = (album: any) => {
      return album.artists.map((artist: any) => artist.name).join(", ");
    };

    return (
      <div>
        {tracks.map((track: any, index: number) => {
          return (
            <div
              className={track === currentSong ? "Current-Song" : "Song"}
              key={index}
            >
              <img
                src={track.album.images[0].url}
                width="75"
                alt={track.name}
              />
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
      <div className={tracks.length && "Song-Card-Container"}>
        <SongDetails tracks={tracks} setTracks={setTracks} />
      </div>
    </WebPlaybackSDK>
  );
};

export default SpotifyPlayer;
