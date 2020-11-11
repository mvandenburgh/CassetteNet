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
        let responsePayload;
        
        // send back full user object if running in development.
        // otherwise don't, due to security
        if (process.env.NODE_ENV === 'production') {
            responsePayload = 'signup successful';
        } else {
            responsePayload = user;
        }
        passport.authenticate('local')(req, res, () => res.send(responsePayload));
    });
});



router.post('/login', passport.authenticate('local'), async (req, res) => {
    const { username, uniqueId, _id, favoritedMixtapes, followedUsers, admin, createdAt, updatedAt, verified } = req.user;
    if (!verified) {
        return res.status(400).send('user not verified.');
    }
    const followedUsersDenormalized = [];
    for (const userId of followedUsers) {
        const user = await User.findById(userId);
        const followerCount = (await User.find({ followedUsers: user._id })).length;
        const createdAt = new Date(user.createdAt);
        const updatedAt = new Date(user.updatedAt);
        followedUsersDenormalized.push({
            _id: userId,
            uniqueId: user.uniqueId,
            username: user.username,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followerCount 
        });
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
    res.send('logged out.');
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

router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.send([]);
    const users = await User.find(User.searchBuilder(query)).lean();
    return res.send(users.map(user => ({
        _id: user._id,
        username: user.username,
        uniqueId: user.uniqueId,
    })));
});

// get a user's mixtapes
// TODO: secure/authentication
router.get('/mixtapes', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtapes = await Mixtape.find({ 'collaborators.user': Types.ObjectId(req.user.id) });
    res.send(mixtapes);
});

router.get('/:id/favoritedMixtapes', async (req, res) => {
    const { favoritedMixtapes } = await User.findOne({ _id: req.params.id }).lean();
    const mixtapes = [];
    for (const mixtapeId of favoritedMixtapes) {
        const mixtape = await Mixtape.findOne({ _id: mixtapeId }).lean();

        // if the mixtape is private, only allow access if the logged in user is a collaborator.
        if (mixtape && !mixtape.isPublic) {
            if (req.user) {
                const collaborators = mixtape.collaborators.map(collaborator => collaborator.user);
                if (!collaborators.includes(req.user.id)) {
                    continue;
                }
            } else {
                continue;
            }
        }
        if (mixtape) {
            const favoriteCount = (await User.find({ favoritedMixtapes: mixtapeId }).lean()).length;
            mixtape.favorites = favoriteCount;
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
    if (req.params.id.length === 5 && req.params.id.charAt(0) === '!') { // search by uniqueId
        const user = await User.findOne({ uniqueId: parseInt(req.params.id.substring(1), 36) }).select('-email -admin -verified -token').lean();
        const followers = (await User.find({ followedUsers: Types.ObjectId(user._id) })).length;
        res.send({ followers, ...user });
    } else { // search by _id
        const user = await User.findById(req.params.id).select('-email -admin -verified -token').lean();
        const followers = (await User.find({ followedUsers: Types.ObjectId(req.params.id) })).length;
        res.send({ followers, ...user });
    }
});


module.exports = router;
