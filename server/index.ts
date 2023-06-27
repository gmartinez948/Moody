import { create } from "domain";

require("dotenv").config();
const axios = require("axios");
const express = require("express");
const querystring = require("querystring");
const port = 80;
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

function generateRandomString(length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

const stateKey = "spotify_auth_state";

app.get("/login", (req, res) => {
  var scope =
    "streaming \
    playlist-modify-private \
    playlist-modify-public \
               user-read-email \
               user-read-playback-state \
               user-read-private";

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: scope,
    redirect_uri: REDIRECT_URI,
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

app.get("/callback/", (req, res) => {
  var code = req.query.code;
  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: REDIRECT_URI,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      if (response.status === 200) {
        fs.writeFileSync(
          "access_token.json",
          JSON.stringify(response.data.access_token)
        );
        res.redirect("http://localhost:3000/moody/");
      }
    })
    .catch((error) => res.json({ error }));
});

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      if (typeof data === "string") {
        resolve(data.split('"').join(""));
      }
    });
  });
};

app.get("/auth_token/", (req, res) => {
  return readFile("access_token.json").then((token) => res.json({ token }));
});

app.get("/recs/", (req, res) => {
  const { seed_genres, min_tempo, max_tempo, max_valence } = req.query;

  async function recommendPlaylistByBPM() {
    try {
      const access_token = await readFile("access_token.json");
      // template for sad songs; testing out
      const response = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=${seed_genres}&limit=20&target_valence=${max_valence}&seed_tracks=${"3UCp4g1EWXVKcrZsW0aGGD,0FUT0sHE6An4sKU4W6LH1c"}&target_energy=${"0.2"}&target_danceability=${"0.2"}&target_popularity=${"10"}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        const tracks = response.data.tracks;
        if (tracks.length > 0) {
          const playlist = tracks.map((track) => track);
          res.json({ playlist });
        } else {
          console.log("No tracks found for the specified BPM range.");
        }
      } else {
        console.log("Error retrieving recommendations:", response.statusText);
      }
    } catch (error) {
      res.json({ error });
    }
  }

  recommendPlaylistByBPM();
});

app.post("/create_playlist_id", (req, res) => {
  const createPlaylistId = async () => {
    try {
      const { playlistName, user_id } = req.body;
      const access_token = await readFile("access_token.json");
      const headers = {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      };
      const playlistData = {
        name: playlistName,
        description: "none",
        public: "true",
      };
      const response = await axios.post(
        `https://api.spotify.com/v1/users/${user_id}/playlists`,
        playlistData,
        { headers }
      );
      res.json(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };
  createPlaylistId();
});

app.post("/create_playlist", (req, res) => {
  const createPlaylist = async () => {
    try {
      const { playlist_id, uris } = req.body;
      const mappedUris = uris.map((track: any) => track.uri);
      const access_token = await readFile("access_token.json");
      const headers = {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      };
      const response = axios.post(
        `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        {
          uris: mappedUris,
        },
        { headers }
      );
      console.log(response.data, "data");
    } catch (error) {
      console.log(error);
    }
  };
  createPlaylist();
});

app.listen(port, (err) => console.log(err ? err : `listening on port ${port}`));
