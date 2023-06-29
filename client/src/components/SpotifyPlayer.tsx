import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { getAuthToken } from "../hooks/getAuthToken";
import "../App.css";
import CircularProgress from "@mui/material/CircularProgress";
import {
  WebPlaybackSDK,
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";
import { NoTracksFound } from "./NoTracksFound";
import { fetchTrack } from "../hooks/fetchTrack";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

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

  const getOAuthToken = useCallback(
    (callback: (arg0: string) => any) => callback(token as string),
    [token]
  );

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
    const device = usePlayerDevice();

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
        {device === null ? (
          <Tooltip title="Playback is unavailable">
            <span className="Disabled-Button">
              <Button disabled>Play</Button>
            </span>
          </Tooltip>
        ) : (
          <button onClick={() => handlePlayPauseClicked(index)}>
            {currentSong !== tracks[index] || !playClicked ? "Play" : "Pause"}
          </button>
        )}
      </div>
    );
  };

  const SongDetails = ({
    tracks,
    setTracks,
  }: {
    tracks: Array<Record<string, any>>;
    setTracks: Dispatch<SetStateAction<any>>;
  }) => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady();
    const device = usePlayerDevice();
    const [currentSong, setCurrentSong] = useState<any>(tracks[0]);
    const player = useSpotifyPlayer();

    useEffect(() => {
      player?.connect();
    }, []);

    const playTrack = (index = 0) => {
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

    const transformArtistNames: any = (album: any) => {
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
                <p style={{ color: track === currentSong ? "black" : "white" }}>
                  {track.name}
                </p>
                <p style={{ color: track === currentSong ? "black" : "white" }}>
                  {transformArtistNames(track.album)}
                </p>
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
