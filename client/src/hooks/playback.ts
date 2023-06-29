import axios from "axios";
import { stringify } from "querystring";

export const startPlayback = async (token: string | null, uri: string) => {
  try {
    if (token !== null) {
      const play = await axios({
        method: "PUT",
        url: "https://api.spotify.com/v1/me/player/play",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          uris: JSON.stringify([uri]),
        },
      });
      console.log("Playback started successfully:", play.data);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pausePlayback = async (token: string | null) => {
  try {
    const pause = await axios({
      method: "PUT",
      url: "https://api.spotify.com/v1/me/player/pause",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Playback started successfully:", pause.data);
  } catch (error) {
    console.log(error);
  }
};
