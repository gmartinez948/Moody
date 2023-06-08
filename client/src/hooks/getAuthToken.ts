import axios from "axios";

export const getAuthToken = async () => {
  await axios.get("http://localhost:80/auth/token").then((response) => {
    console.log(response.data);
    return response.data;
  });
};

export const getTrack = async (authToken: any) => {
  try {
    axios({
      method: "get",
      url: "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg/albums",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    }).then((response) => {
      return response;
    });
  } catch (error) {
    console.log(error);
  }
};
