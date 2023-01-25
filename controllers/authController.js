const dotenv = require('dotenv');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/User');

dotenv.config();

const client_id = process.env.GOOGLE_OAUTH2_CLIENT_ID;
const client_secret = process.env.GOOGLE_OAUTH2_CLIENT_SECRET;
passport.use(
  new GoogleStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: `${process.env.SERVER_URL}/api/auth/google/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      console.log(profile);

      try {
        // check if the user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // if the user doesn't exist create a new user
        user = new User({
          googleId: profile.id,
          username: profile.name.familyName + Date.now(),
          email: profile.emails[0].value,
          profile: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
          },
        });

        await user.save();
        done(null, user);
      } catch (error) {
        console.log('Error:', error);
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports.passport = passport;
