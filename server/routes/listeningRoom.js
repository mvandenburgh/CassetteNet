const express = require('express');
const { Types } = require('mongoose');
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


router.put('/:id/checkIn', async (req, res) => {
    if (!req.user) return res.status(401).send('unauthorized');
    try {
        const listeningRoom = await ListeningRoom.findById(req.params.id);
        if (!listeningRoom) return res.status(404).send('not found');
        const listenerIds = listeningRoom.currentListeners.map(l => l.user);
        if (!listenerIds.includes(req.user.id)) {
            console.log(listeningRoom.currentListeners)
            listeningRoom.currentListeners.push({ user: req.user.id, lastCheckIn: Date.now() / 1000 });
            console.log(listeningRoom.currentListeners)
            await listeningRoom.save();
            const io = req.app.get('socketIO');
            io.emit('userJoined', { username: req.user.username, uniqueId: req.user.uniqueId });
        } else {
            listeningRoom.currentListeners[listenerIds.indexOf(req.user.id)].lastCheckIn = Date.now() / 1000;
            await listeningRoom.save();
        }
        return res.send('joined');
    } catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

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

    const listeningRoom = new ListeningRoom({
        currentListeners: [],
        mixtape: mixtapeId,
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
    try {
        const listeningRoom = await ListeningRoom.findById(Types.ObjectId(req.params.id)).lean();
        if (!listeningRoom) return res.status(404).send('listening room not found');
        const listenersDenormalized = [];
        for (const listener of listeningRoom.currentListeners) {
            const user = await User.findById(listener.user).lean();
            listenersDenormalized.push({
                id: user._id,
                username: user.username,
            });
        }
        listeningRoom.currentListeners = listenersDenormalized;
        return res.send(listeningRoom);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
});


/**
 * Update a listening room
 */
router.put('/:id', async (req, res) => {

});


/**
 * Delete a listening room
 */
router.delete('/:id', async (req, res) => {

});


module.exports = router;
