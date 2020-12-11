const express = require('express');
const mongoose = require('mongoose');
const { InboxMessage, Mixtape, User } = require('../models');
const { generateUsers, generateMixtapes, generateTestData } = require('../testing/generateTestData');

const router = express.Router();

router.post('/populateDatabase', async (req, res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    let { userCount } = req.body;
    if (!userCount) userCount = 50;
    try {
        
        const generatedMixtapes = await generateMixtapes();
        const generatedUsers = await generateUsers(userCount);
        const { inboxMessages, mixtapes, users } = await generateTestData(generatedMixtapes, generatedUsers);
        await InboxMessage.insertMany(inboxMessages);
        res.send('success');
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post('/dropDatabase', async (req, res) => {
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    try {
        const conn = mongoose.connection;
        const collections = await conn.db.listCollections().toArray();
        for (const collection of collections) {
            await conn.db.dropCollection(collection.name);
        }
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
router.put('/deleteAdmin', async(req,res)=>{
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });

    if (user.admin == true ){
        user.admin = false;
        await user.save();
    }
    return res.send(user._id);
});

router.put('/addAdmin', async(req,res)=>{
    if (!req.user || !req.user.admin) {
        return res.status(401).send('unauthorized');
    }
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId });

    if (user.admin == false ){
        user.admin = true;
        await user.save();
    }
    return res.send(user._id);
});


module.exports = router;
