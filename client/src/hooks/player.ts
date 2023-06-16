import axios from "axios";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

export const useStartAndResumePlayer = (token: string, tracks: any) => {
  const device = usePlayerDevice();
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
