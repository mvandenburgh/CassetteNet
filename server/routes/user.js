const express = require('express');
const avatars = require('avatars');
const jimp = require('jimp');
const { Types } = require('mongoose');
const { InboxMessage, Mixtape, User } = require('../models');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.send([]);
    
    let users;
    if (query.charAt(0)=='#' && query.length === 5) {
        const newQuery = parseInt(query.substring(1), 36);
        users = await User.find({ uniqueId: newQuery }).lean();
    }
    else {
        users = await User.find(User.searchBuilder(query)).lean();
    }
    let results = [];
    for (const user of users) {
        const updatedAt =new Date(user.updatedAt);
        const createdAt = new Date(user.createdAt);
        const followerCount = (await User.find({ followedUsers: user._id })).length;
        results.push({
            _id: user._id,
            username: user.username,
            uniqueId: user.uniqueId,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followerCount,
        });
    }
    if (req.user) {
        results = results.filter(user => !user._id.equals(req.user.id));
    }
    return res.send(results);
});

// get a user's mixtapes
// TODO: secure/authentication
router.get('/mixtapes', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtapes = await Mixtape.find({ 'collaborators.user': Types.ObjectId(req.user.id) });
    res.send(mixtapes);
});

router.get('/getFollowedUsers', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const requser = await User.findById(req.user._id);
    const results = [];
    for (const followedUserID of requser.followedUsers) {
        const user = await User.findById(followedUserID);
        const updatedAt =new Date(user.updatedAt);
        const createdAt = new Date(user.createdAt);
        const followerCount = (await User.find({ followedUsers: user._id })).length;
        results.push({
            _id: user._id,
            username: user.username,
            uniqueId: user.uniqueId,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followerCount,
        });
    }
    return res.send(results);
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
    const user = await User.findById(req.user._id);
    if (!user.favoritedMixtapes.includes(id)) {
        user.favoritedMixtapes.push(Types.ObjectId(id));
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

router.put('/followUser', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    if (req.user.id === id) return res.status(400).send('invalid request');
    const user = await User.findById(req.user._id);
    const followedUsersDenormalized = [];
    if (!user.followedUsers.includes(id)) {
        user.followedUsers.push(Types.ObjectId(id));
        await user.save();
    }
    for (const userId of user.followedUsers) {
        const followedUser = await User.findById(userId);
        const followerCount = (await User.find({ followedUsers: followedUser._id })).length;
        const createdAt = new Date(followedUser.createdAt);
        const updatedAt = new Date(followedUser.updatedAt);
        followedUsersDenormalized.push({
            _id: userId,
            uniqueId: followedUser.uniqueId,
            username: followedUser.username,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followerCount 
        });
    }
    return res.send(followedUsersDenormalized);
});

router.put('/unfollowUser', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    const { id } = req.body;
    console.log(id);
    const user = await User.findById(req.user._id);
    if (user.followedUsers.includes(id)) {
        user.followedUsers.splice(user.followedUsers.indexOf(id), 1);
        await user.save();
    }
    const followedUsersDenormalized = [];
    for (const userId of user.followedUsers) {
        const followedUser = await User.findById(userId);
        const followerCount = (await User.find({ followedUsers: followedUser._id })).length;
        const createdAt = new Date(followedUser.createdAt);
        const updatedAt = new Date(followedUser.updatedAt);
        followedUsersDenormalized.push({
            _id: userId,
            uniqueId: followedUser.uniqueId,
            username: followedUser.username,
            createdAt: `${createdAt.getMonth()+1}/${createdAt.getDate()}/${createdAt.getFullYear()}`,
            updatedAt: `${updatedAt.getMonth()+1}/${updatedAt.getDate()}/${updatedAt.getFullYear()}`,
            followers: followerCount 
        });
    }
    return res.send(followedUsersDenormalized);
});

router.put('/profilePicture', async (req, res) => {
    if (!req.user) return res.status(401).send(null);
    if (!req.files || !req.files.profilePicture) return res.status(400).send(null);
    const { profilePicture } = req.files;
    await User.findByIdAndUpdate(req.user._id, { profilePicture: { data: profilePicture.data, contentType: profilePicture.mimetype } });
    res.send('success');
});

router.post('/sendMessage', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    if (!req.body.message || !req.body.recipient) return res.status(400).send();
    const { message, mixtapeId, recipient } = req.body;
    const inboxMessage = {
        mixtape: mixtapeId,
        message,
        recipient,
    };
    try {
        const inboxMessageDb = await InboxMessage.create(inboxMessage);
        res.send(inboxMessage._id);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.delete('/deleteMessage/:id', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    const message = await InboxMessage.findById(req.params.id);
    if (message) {
        await message.deleteOne();
    }
    const inboxMessages = await InboxMessage.find({ recipient: req.user.id }).lean();
    res.send(inboxMessages);
})

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
