const express = require('express');
const passport = require('passport');
const { User } = require('../models');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    User.register(new User( {username, email, verified: false }), password, (err, user) => {
        if (err) res.send(err); // TODO: error handling

        passport.authenticate('local')(req, res, () => res.send(user));
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    
});

module.exports = router;
