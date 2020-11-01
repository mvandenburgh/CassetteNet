const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./auth/passport');

const userRoute = require('./routes/user');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });

const app =  express();

app.use(cors()); // TODO: figure out where/if this is actually needed. for now, apply to all routes.
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize()); 
app.use(passport.session()); 


app.use('/user', userRoute);

const { User } = require('./models');
app.get('/', async (req, res) => {
    const users = await User.find();
    return res.json(users);
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
