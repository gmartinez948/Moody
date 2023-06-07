require("dotenv").config();
const axios = require("axios");
const express = require("express");
const querystring = require("querystring");
const port = 80;
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email";
  const queryParams = querystring.stringify({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    state,
    scope,
  });
  res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get("/callback", (req, res) => {
  const code = req.query.code || null;
  console.log(code, "code");
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
      console.log(response.status, "status");
      if (response.status === 200) {
        const { refresh_token } = response.data;
        axios
          .get(
            `http://localhost:80/refresh_token?refresh_token=${refresh_token}`
          )
          .then((response) => {
            res.send(`<pre>${JSON.stringify(response.data, null, 2)}</pre>`);
          })
          .catch((error) => {
            console.log(error);
            res.send(error);
          });
      } else {
        res.send(response);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

app.get("/refresh_token", (req, res) => {
  const { refresh_token } = req.query;
  axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
      client_id: CLIENT_ID,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
});

app.listen(port, (err) => console.log(err ? err : `listening on port ${port}`));
