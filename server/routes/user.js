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
    const { username, uniqueId, _id, favoritedMixtapes, followedUsers } = req.user
    res.json({
        _id,
        favoritedMixtapes,
        followedUsers,
        username,
        uniqueId, // convert number to base36 to get alphanumeric id
    });
});

router.post('/logout', (req, res) => {
    req.logout(); // passport method to clear jwt from user's cookie
    res.redirect('/');
});

// get a user's mixtapes
// TODO: secure/authentication
router.get('/mixtapes', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtapes = await Mixtape.find({ 'collaborators.user': req.user.id });
    res.send(mixtapes);
});

router.get('/favoritedMixtapes', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const { favoritedMixtapes } = await User.findById(req.user.id);
    const mixtapes = [];
    for (const mixtapeId of favoritedMixtapes) {
        const mixtape = await Mixtape.findById(mixtapeId);
        if (mixtape) {
            mixtapes.push(mixtape);
        }
    }
    res.send(mixtapes);
});

router.put('/favoriteMixtape', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    const user = await User.findById(req.user._id);
    if (!user.favoritedMixtapes.includes(id)) {
        user.favoritedMixtapes.push(id);
        await user.save();
    }
    return res.send(user.favoritedMixtapes);
});

router.put('/unfavoriteMixtape', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    const user = await User.findById(req.user._id);
    if (user.favoritedMixtapes.includes(id)) {
        user.favoritedMixtapes.splice(user.favoritedMixtapes.indexOf(id), 1);
        await user.save();
    }
    return res.send(user.favoritedMixtapes);
});

module.exports = router;
