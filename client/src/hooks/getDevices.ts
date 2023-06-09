import { Dispatch, SetStateAction } from "react";

export const getDevices = async (
  accessToken: string | null,
  setDevices: Dispatch<SetStateAction<never[]>>
) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/devices",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const devices = data.devices.filter(
        (obj: any, index: number, self: any) => {
          return index === self.findIndex((o: any) => o.name === obj.name);
        }
      );

      setDevices(devices);
    } else {
      // Bad or expired token. This can happen if the user revoked a token or the access token has expired. You should re-authenticate the user.
      console.log({ "Failed to retrieve devices.": response });
    }
  } catch (error) {
    console.log(error);
  }
};

export const setSpotifyDevice = async (id: string, token: string) => {
  const deviceResponse = await fetch("https://api.spotify.com/v1/me/player", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      device_ids: [id],
      play: true,
    }),
  });
  if (deviceResponse.status === 204) {
    console.log("successfully transferred playback");
  } else {
    console.error("Failed to transfer playback.");
  }
};
