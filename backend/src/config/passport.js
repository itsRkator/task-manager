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
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if the user already exists based on Google ID or email
          const existingUser = await User.findOne({
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          });

          if (existingUser) {
            // If user exists, return the user
            return done(null, existingUser);
          }

          // Create a new user if not found
          const newUser = await User.create({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            googleToken: accessToken,
            googleTokenSecret: refreshToken,
            avatar: profile.photos[0]?.value, // Use optional chaining for safety
          });

          // Return the new user
          done(null, newUser);
        } catch (err) {
          // Handle errors
          console.error(`Error in Google OAuth strategy: ${err.message}`);
          done(err, null);
        }
      }
    )
  );

  // Serialize user id to session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
