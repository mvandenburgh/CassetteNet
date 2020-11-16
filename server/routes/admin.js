const express = require('express');
const mongoose = require('mongoose');
const { InboxMessage, Mixtape, User } = require('../models');
const generateTestData = require('../testing/generateTestData');

const router = express.Router();

router.post('/populateDatabase', async (req, res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    const { inboxMessages, mixtapes, users } = await generateTestData();
    try {
        await Promise.all([
            ...users.map(user => User.register({
                _id: mongoose.Types.ObjectId(user._id),
                username: user.username,
                email: user.email,
                favoritedMixtapes: user.favoritedMixtapes,
                followedUsers: user.followedUsers,
                admin: user.admin,
                verified: true, // verify all test users
                local: true,
                profilePicture: user.profilePicture
            }, user.password)),
            InboxMessage.insertMany(inboxMessages),
            Mixtape.insertMany(mixtapes)
        ]);
        res.send('success');
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/dropDatabase', async (req, res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    try {
        const conn = mongoose.connection;
        await conn.dropDatabase();
        return res.send('database dropped.');
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.get('/getAdmins', async (req, res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    const users = await User.find({ admin: true });
    return res.send(users.map(user => ({
        _id: user._id,
        username: user.username,
        uniqueId: user.uniqueId,
    })));
});

router.delete('/deleteAdmin', async (req,res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user.admin == true ){
        user.admin = false;
        await user.save();
    }
    return res.send(user._id);
});

router.post('/addAdmin', async (req,res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (user.admin == false ){
        user.admin = true;
        await user.save();
    }
    return res.send(user._id);
});


module.exports = router;
