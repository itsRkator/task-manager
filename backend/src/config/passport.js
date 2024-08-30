const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
      },
      async (token, tokenSecret, profile, done) => {
        const existingUser = await User.findOne({
          $or: [
            { googleId: profile.id }, // Match based on Google ID
            { email: profile.emails[0].value }, // Match based on email
          ],
        });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          googleToken: token,
          googleTokenSecret: tokenSecret,
          avatar: profile.photos[0].value,
        });
        done(null, newUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};
