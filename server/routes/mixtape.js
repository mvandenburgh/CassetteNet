const express = require('express');
const { Mixtape, User } = require('../models');

const router = express.Router();

// CREATE MIXTAPE
router.post('/', async (req, res) => {
    const { mixtape } = req.body;
    await Mixtape.create(mixtape);
    return res.send(mixtape);
});

// RETRIEVE MIXTAPE
router.get('/:id', async (req, res) => {
    const mixtape = await Mixtape.findById(req.params.id);
    for (const collaborator of mixtape.collaborators) {
        const user = await User.findById(collaborator.user);
        collaborator.username = user.username;
    }
    return res.send(mixtape);
});

// UPDATE MIXTAPE
router.put('/:id', async (req, res) => {
    const { mixtape } = req.body;
    await Mixtape.findOneAndUpdate({  _id: mixtape._id }, mixtape);
    return res.send(mixtape);
});

// DELETE MIXTAPE
router.delete('/:id', async (req, res) => {
    const { mixtape } = req.body;
    await Mixtape.findOneAndDelete({  _id: mixtape._id }, mixtape);
    return res.send(mixtape);
});

module.exports = router;
