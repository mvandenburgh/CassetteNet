const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const { User } = require('../models');

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect',
    }, async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            done(null, user);
        } else {
            const newUser = await new User({ email: profile.emails[0].value, strategy: 'google' }).save();
            done(null, newUser);
        }
    })
);

passport.use(
    new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/auth/facebook/redirect',
        profileFields: ['id', 'emails', 'name']
    }, async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
            done(null, user);
        } else {
            const newUser = await new User({ email: profile.emails[0].value, strategy: 'facebook' }).save();
            done(null, newUser);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});

module.exports = passport;
