const express = require('express');
const mongoose = require('mongoose');
const { InboxMessage, Mixtape, User } = require('../models');
const generateTestData = require('../testing/generateTestData');

const router = express.Router();

// TODO: secure this route
router.post('/populateDatabase', async (req, res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    const { inboxMessages, mixtapes, users } = await generateTestData();
    await Promise.all([...users.map(user => User.register({ _id: mongoose.Types.ObjectId(user._id), username: user.username, email: user.email, favoritedMixtapes: user.favoritedMixtapes, followedUsers: user.followedUsers, admin: user.admin, profilePicture: user.profilePicture }, user.password)), InboxMessage.insertMany(inboxMessages), Mixtape.insertMany(mixtapes)]);
    return res.json({
        inboxMessages,
        mixtapes,
        users,
    });
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


module.exports = router;
