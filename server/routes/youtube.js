const express = require('express');
const { parse, toSeconds } = require('iso8601-duration');

const { getVideoInfo, searchVideo } = require('../external_apis/youtube');

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


module.exports = router;
