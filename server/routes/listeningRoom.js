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

    const listeningRoom = new ListeningRoom({
        currentListeners: [req.user.id],
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
        const listeningRoom = await ListeningRoom.findById(req.params.id).lean();
        const listenersDenormalized = [];
        for (const userId of listeningRoom.currentListeners) {
            const user = await User.findById(userId).lean();
            listenersDenormalized.push({
                id: user._id,
                username: user.username,
            });
        }
        listeningRoom.currentListeners = listenersDenormalized;
        return res.send(listeningRoom);
    } catch (err) {
        console.log(err);
        return res.status(404).send('listening room not found');
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
