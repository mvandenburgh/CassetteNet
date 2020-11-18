const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); // stores session info in database instead of server memory
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./auth/passport');

// import routes
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const listeningRoomRoute = require('./routes/listeningRoom');
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

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/admin', adminRoute);
app.use('/api/auth', authRoute);
app.use('/api/listeningroom', listeningRoomRoute);
app.use('/api/mixtape', mixtapeRoute);
app.use('/api/soundcloud', soundcloudRoute);
app.use('/api/user', userRoute);
app.use('/api/youtube', youtubeRoute);

app.use('/', express.static('build'));
app.get('*', (req, res) => res.sendFile('index.html', { root: path.join(__dirname, 'build') }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
