const express = require('express');
const { ListeningRoom, Mixtape, User } = require('../models');

const router = express.Router();

/**
 * Determines whether a given user has permission to view a given mixtape
 * @param {*} user 
 * @param {*} mixtape 
 */
function isAuthorized(user, mixtape) {
    if (mixtape.isPublic) return true;
    if (!user) return false;
    for (const collaborator of mixtape.collaborators) {
        if (collaborator.user.equals(user._id)) {
            return true;
        }
    }
    return false;
}


/**
 * Create a listening room
 */
router.post('/', async (req, res) => {
    if (!req.user) {
        return res.status(401).send('unauthorized');
    }

    const { mixtapeId } = req.body;
    const mixtape = await Mixtape.findById(mixtapeId).lean();

    if (!isAuthorized(req.user, mixtape)) {
        return res.status(401).send('unauthorized');
    }

    // remove fields that aren't needed for listening room
    delete mixtape.isPublic;
    delete mixtape.collaborators;

    const listeningRoom = new ListeningRoom({
        chatMessages: [],
        currentListeners: [],
        mixtape,
        owner: req.user.id,
        currentSong: 0,
        snakeScores: [],
        rhythmScores: [],
    });

    await listeningRoom.save();

    return res.send(listeningRoom._id);
});


/**
 * Get info about a listening room
 */
router.get('/:id', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    try {
        const listeningRoom = await ListeningRoom.findById(req.params.id).lean();
        if (!listeningRoom) return res.status(404).send('listening room not found');
        if (!listeningRoom.owner.equals(req.user.id) && !listeningRoom.invitedUsers.includes(req.user.id)) return res.status(401).send('unauthorized');
        const listenersDenormalized = [];
        for (const userId of listeningRoom.currentListeners) {
            const user = await User.findById(userId).lean();
            listenersDenormalized.push({
                id: user._id,
                username: user.username,
            });
        }
        listeningRoom.currentListeners = listenersDenormalized;
        const owner = await User.findById(listeningRoom.owner).lean();
        listeningRoom.owner = { user: owner._id, username: owner.username };
        return res.send(listeningRoom);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

router.put('/:id/inviteUser', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    if (!req.body && !req.body.user) return res.status(400).send('invalid request');
    try {
        const listeningRoom = await ListeningRoom.findById(req.params.id);
        if (!listeningRoom.owner.equals(req.user.id)) return res.status(401).send('unauthorized');
        if (!listeningRoom.invitedUsers.includes(req.body.user)) {
            listeningRoom.invitedUsers.push(req.body.user);
            await listeningRoom.save();
        }
        return res.send(req.body.user);
    } catch(err) {
        return res.status(500).send(err);
    }
});

module.exports = router;
