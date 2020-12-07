const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session); // stores session info in database instead of server memory
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const passport = require('./auth/passport');
const passportSocketIo = require('passport.socketio');
const initSockets = require('./sockets');

// import routes
const adminRoute = require('./routes/admin');
const authRoute = require('./routes/auth');
const listeningRoomRoute = require('./routes/listeningRoom');
const mixtapeRoute = require('./routes/mixtape');
const soundcloudRoute = require('./routes/soundcloud');
const userRoute = require('./routes/user');
const youtubeRoute = require('./routes/youtube');

// connect server to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// initialize collection in database to store login sessions
const store = new MongoDBStore({
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    collection: 'sessions'
});

const app =  express();

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // TODO: decide on file size limit
}));
app.use(cookieParser()); // middleware for parsing cookies in requests
app.use(bodyParser.urlencoded({ extended: false })); // middleware for parsing req.body
app.use(bodyParser.json());

const SESSION_KEY = 'connect.sid';
const SESSION_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';

app.use(session({ // initialize login sessions
    key: SESSION_KEY,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400000, // expire in one day
        secure: false,
        sameSite: 'none',
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
const server = http.createServer(app);

const io = socketIO(server);
io.use(passportSocketIo.authorize({
    cookieParser,
    key: SESSION_KEY,
    secret: SESSION_SECRET,
    store,
    fail: () => { throw new Error('passport-socket.io failed!') },
}));
initSockets(io);

server.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
