const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

// Google OAuth2 strategy for authentication
passport.use(new GoogleStrategy({
  clientID: '623077210535-p5840ajm4rs63munfqegs50r7fh20nb6.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: 'http://localhost:5000/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
