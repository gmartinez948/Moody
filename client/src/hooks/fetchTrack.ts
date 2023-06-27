export const fetchTrack = (
  mappedUris: Array<any>,
  index = 0,
  token: string,
  device: any
) => {
  if (device) {
    fetch(
      `https://api.spotify.com/v1/me/player/play?device_id=${device?.device_id}`,
      {
        method: "PUT",
        body: JSON.stringify({ uris: [mappedUris[index]] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } else {
    console.log("No device");
  }
};
