const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const { User } = require('../models');

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
        if (err) { 
            return done(err);
        } else if (!user) { 
            return done(null, false);
        } else if (!user.verifyPassword(password)) { 
            return done(null, false);
        } else {
            return done(null, user);
        }
    });
}));
