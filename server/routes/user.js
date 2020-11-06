const express = require('express');
const passport = require('passport');
const { Mixtape, User } = require('../models');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    // this new user should be an admin if there are 0 users currently
    const userCount = await User.estimatedDocumentCount();

    User.register(new User({ username, email, verified: false, admin: userCount === 0 }), password, (err, user) => {
        if (err) res.send(err); // TODO: error handling
        else{
            
        passport.authenticate('local')(req, res, () => res.send(user));
        }
        
    });
});



router.post('/login', passport.authenticate('local'), (req, res) => {
    const { username, uniqueId, _id } = req.user
    res.json({
        _id,
        username,
        uniqueId, // convert number to base36 to get alphanumeric id
    });
});

router.post('/logout', (req, res) => {
    req.logout(); // passport method to clear jwt from user's cookie
    res.redirect('/');
});

// TODO: secure/authentication
router.get('/mixtapes', async (req, res) => {
    const mixtapes = await Mixtape.find({ 'collaborators.user': req.user.id });
    res.send(mixtapes);
});

module.exports = router;
