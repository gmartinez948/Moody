import axios from "axios";

export const getAuthToken = async () => {
  return new Promise((resolve) => {
    resolve(
      axios
        .get("http://localhost:80/auth_token")
        .then((response) => response.data.token)
    );
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
