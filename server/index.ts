import { rejects } from "assert";
import { access } from "fs";

require("dotenv").config();
const axios = require("axios");
const express = require("express");
const querystring = require("querystring");
const port = 80;
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const fs = require("fs");
let access_token;

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
               user-read-email \
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

app.get("/recs/", (req, res) => {
  const minBPM = 60; // Minimum BPM for the playlist
  const maxBPM = 100; // Maximum BPM for the playlist
  const max_v = 0.8;

  async function recommendPlaylistByBPM() {
    try {
      const access_token = await readFile("access_token.json");
      const response = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=latin&min_tempo=${minBPM}&max_tempo=${maxBPM}&limit=10&max_valence=${max_v}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data, "recommended");
        const tracks = response.data.tracks;
        if (tracks.length > 0) {
          const playlist = tracks.map((track) => track);
          // console.log("Recommended Playlist:", playlist);
        } else {
          console.log("No tracks found for the specified BPM range.");
        }
      } else {
        console.log("Error retrieving recommendations:", response.statusText);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  recommendPlaylistByBPM();
});

app.get("/artists/", (req, res) => {
  const searchQuery = "Love";
  async function searchRandomArtists() {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?type=artist&q=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          },
        }
      );

      if (response.status === 200) {
        const artists = response.data.artists.items;
        console.log(artists);
        if (artists.length > 0) {
          const randomIndex = Math.floor(Math.random() * artists.length);
          const randomArtist = artists[randomIndex];
          console.log("Random Artist:", randomArtist.name);
        } else {
          console.log("No artists found.");
        }
      } else {
        console.log("Error retrieving artists:", response.statusText);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  searchRandomArtists();
});

// gets recommendations from the api
app.get(`/recommendations/`, (req, res) => {
  if (access_token) {
    const url =
      "https://api.spotify.com/v1/recommendations?seed_artists=party&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA";
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => {
        console.log(response);
        res.json({ data: response.data });
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    res.redirect("http://localhost:3000/");
  }
});

app.listen(port, (err) => console.log(err ? err : `listening on port ${port}`));
