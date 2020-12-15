const express = require('express');
const fs = require('fs');
const { getSongInfo, searchSong, streamSongAudio } = require('../external_apis/soundcloud');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { q, page } = req.query;
    try {
        const results = await searchSong(q, page);
        const response = results
        .filter(res => res.duration === res.full_duration)
        .map(song => ({
            id: song.id,
            name: `${song.title} (${song.user.username})`,
            description: song.description,
            coverImage: song.artwork_url,
            playbackUrl: song.permalink_url,
            type: 'soundcloud',
        }));
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get('/itemDuration', async (req, res) => {
    const { itemId } = req.query;
    try {
        const results = await getSongInfo(itemId);
        const duration = results.duration / 1000; // soundcloud api returns duration in milliseconds
        res.json(duration);
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
