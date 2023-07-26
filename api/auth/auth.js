const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const { createClient } = require("@supabase/supabase-js");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_API_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: REDIRECT_URI,
    },
    async function (accessToken, refreshToken, expires_in, profile, done) {
      try {
        const { data: users, error } = await supabase
          .from("User")
          .select("*")
          .eq("spotifyId", profile.id);

        if (error) {
          console.error("Error finding user:", error.message);
          return done(error);
        }
        if (users.length > 0) {
          // User found, return the existing user
          return done(null, users[0]);
        } else {
          // User not found, create a new user entry in the database
          const { data: newUser, error: createUserError } = await supabase
            .from("User")
            .insert([
              { spotifyId: profile.id, accessToken, refreshToken, expires_in },
            ]);

          if (createUserError) {
            // Handle error if user creation fails
            console.error("Error creating user:", createUserError.message);
            return done(createUserError);
          }
          return done(null, newUser);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
