const express = require('express');
const passport = require('passport');
const crypto = require('crypto');
const avatars = require('avatars');
const jimp = require('jimp');
const { Types } = require('mongoose');
const { Mixtape, User } = require('../models');
const { sendVerificationEmail } = require('../email/email');

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;
    // this new user should be an admin if there are 0 users currently
    const userCount = await User.estimatedDocumentCount();

    // generate email verification token
    const token = crypto.randomBytes(64).toString('hex');

    User.register(new User({ username, email, token, verified: false, admin: userCount === 0 }), password, async (err, user) => {
        if (err) return res.status(500).send(err); // TODO: error handling
        if (process.env.NODE_ENV === 'production') { // only send email in production deployment (i.e. heroku)
            try {
                await sendVerificationEmail(email, token);
            } catch(err) {
                console.log(err); // TODO: error handling    
            }
        }
        passport.authenticate('local')(req, res, () => res.send(user));
    });
});



router.post('/login', passport.authenticate('local'), async (req, res) => {
    const { username, uniqueId, _id, favoritedMixtapes, followedUsers, admin, createdAt, updatedAt } = req.user;
    const followedUsersDenormalized = [];
    for (const userId of followedUsers) {
        const user = await User.findById(userId);
        const followerCount = (await User.find({ followedUsers: user._id })).length;
        followedUsersDenormalized.push({ _id: userId, uniqueId: user.uniqueId, username: user.username, followers: followerCount });
    }
    const followers = (await User.find({ followedUsers: _id })).length;
    res.json({
        _id,
        favoritedMixtapes,
        followedUsers: followedUsersDenormalized,
        followers,
        username,
        uniqueId, // convert number to base36 to get alphanumeric id
        admin,
        createdAt,
        updatedAt,
    });
});

router.post('/logout', (req, res) => {
    req.logout(); // passport method to clear jwt from user's cookie
    res.redirect('/');
    
});

router.put('/verify', async (req, res) => {
    const { token } = req.body;
    try {
        await User.updateOne({ token }, { verified: true });
        res.send('user verified');
    } catch (err) {
        res.status(500).send(err)
    }
});

// get a user's mixtapes
// TODO: secure/authentication
router.get('/mixtapes', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtapes = await Mixtape.find({ 'collaborators.user': Types.ObjectId(req.user.id) });
    res.send(mixtapes);
});

router.get('/favoritedMixtapes', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const { favoritedMixtapes } = await User.findOne({ _id: req.user.id });
    const mixtapes = [];
    for (const mixtapeId of favoritedMixtapes) {
        const mixtape = await Mixtape.findOne({ _id: mixtapeId });
        if (mixtape) {
            mixtapes.push(mixtape);
        }
    }
    res.send(mixtapes);
});

router.put('/favoriteMixtape', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    if (!user.favoritedMixtapes.includes(id)) {
        user.favoritedMixtapes.push(id);
        await user.save();
    }
    return res.send(user.favoritedMixtapes);
});

router.put('/unfavoriteMixtape', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    const user = await User.findOne({ _id: req.user._id });
    if (user.favoritedMixtapes.includes(id)) {
        user.favoritedMixtapes.splice(user.favoritedMixtapes.indexOf(id), 1);
        await user.save();
    }
    return res.send(user.favoritedMixtapes);
});

router.put('/profilePicture', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    if (!req.files || !req.files.profilePicture) return res.status(400).send(null);
    const { profilePicture } = req.files;
    await User.findByIdAndUpdate(req.user._id, { profilePicture: { data: profilePicture.data, contentType: profilePicture.mimetype } });
    res.send('success');
});

router.get('/:id/profilePicture', async (req, res) => {
    const user = await User.findById(req.params.id).select('+profilePicture');
    if (user && user.profilePicture && user.profilePicture.data && user.profilePicture.contentType) {
        res.set('Content-Type', user.profilePicture.contentType);
        res.send(user.profilePicture.data.buffer);
    } else if (user) {
        const avatar = await avatars({ seed: user._id });
        const j = await new jimp({
            data: avatar.bitmap.data,
            width: avatar.bitmap.width,
            height: avatar.bitmap.height,
        });
        const pngConversion = await j.getBufferAsync(jimp.MIME_PNG);
        res.set('Content-Type', 'image/png');
        res.send(pngConversion);
    } else {
        res.status(404).send('user not found');
    }
});

// Get info about any user. Exclude sensitive fields since this is public.
router.get('/:id', async (req, res) => {
    console.log(req.params.id)
    const user = await User.findById(req.params.id).select('-email -admin').lean();
    const followers = (await User.find({ followedUsers: Types.ObjectId(req.params.id) })).length;
    res.send({ followers, ...user });
});


module.exports = router;
