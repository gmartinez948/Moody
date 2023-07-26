require("dotenv").config();
const axios = require("axios");
const express = require("express");
const querystring = require("querystring");
const port = 80;
const app = express();
const cors = require("cors");
const passport = require("passport");
require("./auth/auth.js");
const { createClient } = require("@supabase/supabase-js");
const session = require("express-session");
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
const fs = require("fs");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SESSION_SECRET = process.env.SESSION_SECRET;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/login",
  passport.authenticate("spotify", {
    scope: [
      "streaming",
      "playlist-modify-private",
      "playlist-modify-public",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-read-private",
    ],
    showDialog: true,
  })
);

app.get(
  "/auth/callback/",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:3000/moody/");
  }
);

app.get("/auth_token/", (req, res) => {
  if (req.user) {
    return res.json({ token: req.user.accessToken });
  }
});

app.get("/recs/", (req, res) => {
  const {
    seed_genres,
    target_tempo,
    target_valence,
    target_danceability,
    target_energy,
  } = req.query;

  async function recommendPlaylistByBPM() {
    try {
      if (!req.user) {
        res.redirect("/login");
      }
      const access_token = req.user.accessToken;
      const response = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=${seed_genres}&limit=20&target_valence=${target_valence}&target_tempo=${target_tempo}&target_energy=${target_energy}&target_danceability=${target_danceability}`,
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
          res.json({ playlist: [] });
        }
      } else {
        res.json({ playlist: [] });
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  recommendPlaylistByBPM();
});

app.post("/create_playlist_id", (req, res) => {
  const createPlaylistId = async () => {
    try {
      if (!req.user) {
        res.redirect("/login");
      }
      const { playlistName, user_id } = req.body;
      const access_token = req.user.accessToken;
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
      if (!req.user) {
        res.redirect("/login");
      }
      const { playlist_id, uris } = req.body;
      const mappedUris = uris.map((track) => track.uri);
      const access_token = req.user.accessToken;
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
