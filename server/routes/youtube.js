const express = require('express');
const { parse, toSeconds } = require('iso8601-duration');
const ytpl = require('ytpl');
const { getVideoInfo, searchVideo } = require('../external_apis/youtube');

const parseYtplDuration = (s) => {
    const splt = s.split(':');
    if (splt.length === 3) {
        return Number(splt[0]) * 3600 + Number(splt[1]) * 60 + Number(splt[2]);
    } else if (splt.length === 2) {
        return Number(splt[0]) * 60 + Number(splt[1]);
    } else if (splt.length === 1) {
        return Number(splt[0]);
    } else {
        return 0;
    }
}

const router = express.Router();

router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const results = await searchVideo(q);
        const response = results.filter(result => result.id.kind === 'youtube#video').map((result) => ({
            id: result.id.videoId,
            name: result.snippet.title,
            description: result.snippet.description,
            coverImage: result.snippet.thumbnails.default.url,
            type: 'youtube',
            playbackUrl: `https://www.youtube.com/watch?v=${result.id.videoId}`,
        }));
        res.send(response);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/itemDuration', async (req, res) => {
    const { itemId } = req.query;
    try {
        const results = await getVideoInfo(itemId);
        const duration = toSeconds(parse(results[0].contentDetails.duration));
        res.json(duration);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.get('/playlist', async (req, res) => {
    const { link } = req.query;
    try {
        const results = await ytpl(link);
        const mixtape = {
            name: results.title,
            songs: results.items.map(song => ({
                name: song.title,
                id: song.id,
                coverImage: song.bestThumbnail.url,
                type: 'youtube',
                playbackUrl: song.shortUrl,
                duration: parseYtplDuration(song.duration),
            })),
            isPublic: false,
        }
        res.send(mixtape);
    } catch (err) {
        console.log(err);
        res.status(404).send('playlist not found');
    }
});


module.exports = router;
