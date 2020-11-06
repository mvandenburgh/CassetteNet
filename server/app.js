const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');

const userRoute = require('./routes/user');
const adminRoute = require('./routes/admin');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const app =  express();

app.use(cors()); // TODO: figure out where/if this is actually needed. for now, apply to all routes.
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize()); 
app.use(passport.session()); 

const LocalStrategy = require('passport-local');

const { User } = require('./models');

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
 
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/admin', adminRoute);
app.use('/user', userRoute);

app.get('/', async (req, res) => {
    const users = await User.find();
    return res.json(users);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
