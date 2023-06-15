import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import {
  WebPlaybackSDK,
  usePlaybackState,
  usePlayerDevice,
  useSpotifyPlayer,
  useWebPlaybackSDKReady,
} from "react-spotify-web-playback-sdk";

type PlayerDevice = {
  device_id: string;
  status: "ready" | "not_ready";
};

const getAuthToken = async () => {
  return new Promise((resolve) => {
    resolve(
      axios
        .get("http://localhost:80/auth_token")
        .then((response) => response.data.token)
    );
  });
};

const MySpotifyPlayer = ({ tracks }: any) => {
  const [token, setToken] = useState(null);
  console.log(tracks.map((track: any) => track.uri));
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

  const getOAuthToken = useCallback((callback: any) => {
    const authToken = async () => {
      try {
        const token = await getAuthToken();
        await callback(token);
      } catch (error) {
        console.log(error);
      }
    };
    authToken();
  }, []);

  const MyPlayer = () => {
    const webPlaybackSDKReady = useWebPlaybackSDKReady();
    const device = usePlayerDevice();
    // console.log(device, "device");
    const playbackState = usePlaybackState();
    // console.log(playbackState);

    if (!webPlaybackSDKReady) return <div>Loading...</div>;

    const playCarlyRaeJepsen = () => {
      const mappedUris = tracks.map((track: any) => track.uri);
      if (device === null) return;

      fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${device.device_id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            uris: mappedUris,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((result) => console.log(result))
        .catch((error) => console.log(error));
    };

    if (device === null) return null;

    return <button onClick={playCarlyRaeJepsen}>Play Carly Rae Jepsen</button>;
  };

  const PauseResumeButton = () => {
    const player = useSpotifyPlayer();

    if (player === null) return null;

    return (
      <div>
        <button onClick={() => player.pause()}>pause</button>
        <button onClick={() => player.resume()}>resume</button>
      </div>
    );
  };

  return (
    <div style={{ background: "blue" }}>
      <WebPlaybackSDK
        initialDeviceName="My awesome Spotify app"
        getOAuthToken={getOAuthToken}
        initialVolume={0.5}
        connectOnInitialized={true}
      >
        {/* `TogglePlay` and `SongTitle` will be defined later. */}
        {/* <TogglePlay />
      <SongTitle /> */}
        <MyPlayer />
        {/* <PauseResumeButton /> */}
      </WebPlaybackSDK>
    </div>
  );
};

export default MySpotifyPlayer;
