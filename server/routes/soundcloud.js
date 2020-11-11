const express = require('express');

const { getSongInfo, searchSong, streamSongAudio } = require('../external_apis/soundcloud');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const results = await searchSong(q);
        const response = results.map(song => ({
            id: song.id,
            name: song.title,
            description: song.description,
            coverImage: song.artwork_url,
            type: 'soundcloud',
        }));
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/itemDuration', async (req, res) => {
    const { itemId } = req.query;
    try {
        const results = await getSongInfo(itemId);
        console.log(results);
        const duration = results.duration;
        res.json(duration);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/streamAudio/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const stream = await streamSongAudio(itemId);
    stream.pipe(res);
});


module.exports = router;
