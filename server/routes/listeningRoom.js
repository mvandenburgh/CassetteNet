const express = require('express');
const axios = require('axios');
const { ListeningRoom, Mixtape, User } = require('../models');
// const { getAudioAnalysisFromYoutube } = require('../external_apis/spotify');

let STREAM_SERVER_ROOT_URL;
try {
    STREAM_SERVER_ROOT_URL = new URL(process.env.STREAM_SERVER_ROOT_URL).href;
} catch (err) {
    STREAM_SERVER_ROOT_URL = new URL('http://localhost:5001/').href;
}

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


router.get('/:id/rhythm/scores', async (req, res) => {
    const listeningRoom = await ListeningRoom.findById(req.params.id).lean();
    if (listeningRoom) {
        const newRhythmScores = [];
        for (const userId in listeningRoom.rhythmScores) {
            const user = await User.findById(userId).lean();
            newRhythmScores.push({
                score: listeningRoom.rhythmScores[userId],
                user: userId,
                username: user.username,
            });
        }
        return res.send(newRhythmScores);
    } else {
        return res.status(404).send('listening room not found.');
    }
});

router.get('/:id/snake/scores', async (req, res) => {
    const listeningRoom = await ListeningRoom.findById(req.params.id).lean();
    if (listeningRoom) {
        const newRhythmScores = [];
        for (const userId in listeningRoom.snakeScores) {
            const user = await User.findById(userId).lean();
            newRhythmScores.push({
                score: listeningRoom.snakeScores[userId],
                user: userId,
                username: user.username,
            });
        }
        return res.send(newRhythmScores);
    } else {
        return res.status(404).send('listening room not found.');
    }
});

router.delete('/:id/snake/scores', async (req, res) => {
    const listeningRoom = await ListeningRoom.findById(req.params.id);
    console.log('clearing snake scores.')
    if (listeningRoom) {
        listeningRoom.snakeScores = new Map();
        listeningRoom.markModified('snakeScores');
        await listeningRoom.save();
        res.send('success');
    } else {
        return res.status(404).send('listening room not found.');
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

    // remove fields that aren't needed for listening room
    delete mixtape.isPublic;
    delete mixtape.collaborators;

    const listeningRoom = new ListeningRoom({
        chatMessages: [],
        currentListeners: [],
        owner: req.user.id,
        currentSong: 0,
        snakeScores: new Map(),
        rhythmScores: new Map(),
    });

    let stream;
    try {
        stream = await axios.post(new URL('/startStream', STREAM_SERVER_ROOT_URL).href, 
            { 
                type: mixtape.songs[0].type,
                id: mixtape.songs[0].id,
                getTempo: false, // not possible to play rhythm game on first song in LR, so no need for tempo.
            }
        );
    } catch (err) {
        return res.send('error starting stream');
    }

    const { listeningRoomPlaybackId } = stream.data;

    const listeningRoomPlaybackUrl = new URL(`/stream/live/${listeningRoomPlaybackId}.flv`, STREAM_SERVER_ROOT_URL).href;

    mixtape.songs[0].listeningRoomPlaybackUrl = listeningRoomPlaybackUrl;

    listeningRoom.mixtape = mixtape;

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
        // if (!listeningRoom.owner.equals(req.user.id) && !listeningRoom.invitedUsers.includes(req.user.id)) return res.status(401).send('unauthorized');
        const listenersDenormalized = [];
        for (const listener of listeningRoom.currentListeners) {
            const user = await User.findById(listener).lean();
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

// router.get('/:id/audioAnalysis/:songIndex', async (req, res) => {
//     if (!req.user) return res.status(401).send('unauthorized');
//     const listeningRoom = await ListeningRoom.findById(req.params.id).lean();
//     const song = listeningRoom.mixtape.songs[req.params.songIndex];
//     if (song.type !== 'youtube') return res.status(400).send(`audio analysis only works with youtube. requested song is from ${song.type}.`);
//     // const analysis = await getAudioAnalysisFromYoutube(song.id);
//     // res.json(analysis.track.tempo); // just send tempo for now
//     res.send(null);
// });

module.exports = router;
