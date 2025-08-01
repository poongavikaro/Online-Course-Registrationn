const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });
          
          if (user) {
            // Update last login and device info
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          } else {
            // Check if user exists with same email
            let existingUser = await User.findOne({ email: profile.emails[0].value });
            
            if (existingUser) {
              // Link Google account to existing user
              existingUser.googleId = profile.id;
              existingUser.avatar = profile.photos[0].value;
              existingUser.lastLogin = new Date();
              await existingUser.save();
              return done(null, existingUser);
            } else {
              // Create new user
              const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value,
                role: profile.emails[0].value === process.env.ADMIN_EMAIL ? 'admin' : 'student'
              });
              
              const savedUser = await newUser.save();
              return done(null, savedUser);
            }
          }
        } catch (error) {
          console.error('Error in Google Strategy:', error);
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};