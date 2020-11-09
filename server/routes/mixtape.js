const express = require('express');
const { Types } = require('mongoose');
const { Mixtape, User } = require('../models');

const router = express.Router();


router.put('/:id/coverImage', async (req, res) => {
    if (!req.files || !req.files.coverImage) return res.status(400).send('no file uploaded.');
    const { coverImage } = req.files;
    await Mixtape.findByIdAndUpdate(req.params.id, { coverImage: { data: coverImage.data, contentType: coverImage.mimetype } });
    const mixtape = await Mixtape.findById(req.params.id);
    res.send(mixtape);
});


router.get('/:id/coverImage', async (req, res) => {
    const mixtape = await Mixtape.findById(req.params.id).select('+coverImage');
    if (mixtape && mixtape.coverImage) {
        res.set('Content-Type', mixtape.coverImage.contentType);
        res.send(mixtape.coverImage.data.buffer);
    } else {
        res.status(404).send('mixtape not found');
    }
});


// CREATE MIXTAPE
router.post('/', async (req, res) => {
    if (!req.user) return res.status(401).send([]);
    const mixtape = {
        name: 'New Mixtape',
        collaborators: [{ user: req.user.id, permissions: 'owner', username: req.user.username }],
        songs: [],
        isPublic: false
    };
    const mixtapeObject = await Mixtape.create(mixtape);
    return res.send(mixtapeObject);
});

// RETRIEVE MIXTAPE
router.get('/:id', async (req, res) => {
    const mixtape = await Mixtape.findOne({ _id: (req.params.id) });
    for (const collaborator of mixtape.collaborators) {
        const user = await User.findOne({ _id: (collaborator.user) });
        collaborator.username = user.username;
    }
    delete mixtape.coverImage;
    return res.send(mixtape);
});

// UPDATE MIXTAPE
router.put('/:id', async (req, res) => {
    const { mixtape } = req.body;
    for (const collaborator of mixtape.collaborators) {
        collaborator.user = Types.ObjectId(collaborator.user);
    }
    await Mixtape.findOneAndUpdate({  _id: mixtape._id }, mixtape);
    return res.send(mixtape);
});

// DELETE MIXTAPE
router.delete('/:id', async (req, res) => {
    // const { mixtape } = req.body;
    const mixtape = await Mixtape.findOne({ _id: req.params.id });
    await Mixtape.deleteOne({  _id: mixtape._id });
    const users = await User.find({ favoritedMixtapes: { $in: mixtape._id } });
    for (const user of users) {
        const newarr = user.favoritedMixtapes.filter(favoritedMixtape => favoritedMixtape._id != req.params.id);
        user.favoritedMixtapes = newarr;
        user.save();
    }
    return res.send(mixtape);
});

module.exports = router;
