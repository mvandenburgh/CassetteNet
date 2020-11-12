const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); // stores session info in database instead of server memory
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// import user model (needed for passport config)
const { User } = require('./models');

// import routes
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const mixtapeRoute = require('./routes/mixtape');
const soundcloudRoute = require('./routes/soundcloud');
const userRoute = require('./routes/user');
const youtubeRoute = require('./routes/youtube');

// connect server to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

// initialize collection in database to store login sessions
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    collection: 'sessions'
});

const app =  express();

app.set('trust proxy', 1) // trust first proxy (needed for netlify)
app.use(cors({ credentials: true, origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000' }));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // TODO: decide on file size limit
}));
app.use(cookieParser()); // middleware for parsing cookies in requests
app.use(bodyParser.urlencoded({ extended: false })); // middleware for parsing req.body
app.use(bodyParser.json());
app.use(session({ // initialize login sessions
    secret: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    store,
}));

// use static authenticate method of model in LocalStrategy
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
            const newUser = await new User({ email: profile.emails[0].value }).save();
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
            const newUser = await new User({ email: profile.emails[0].value }).save();
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


app.use(passport.initialize());
app.use(passport.session());

app.use('/admin', adminRoute);
app.use('/auth', authRoute);
app.use('/mixtape', mixtapeRoute);
app.use('/soundcloud', soundcloudRoute);
app.use('/user', userRoute);
app.use('/youtube', youtubeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
