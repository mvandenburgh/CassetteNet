const express = require('express');
const fs = require('fs');
const { getSongInfo, searchSong, streamSongAudio } = require('../external_apis/soundcloud');

const router = express.Router();

router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const results = await searchSong(q);
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
    const chunks = [];
    for await (chunk of stream) {
        chunks.push(chunk);
    }
    const buf = Buffer.concat(chunks);
    fs.writeFileSync(`mp3/${itemId}.mp3`, buf);
    const total = fs.statSync(`mp3/${itemId}.mp3`).size;
    if (req.headers.range) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, "").split("-");
        const partialstart = parts[0];
        const partialend = parts[1];
        const start = parseInt(partialstart, 10);
        const end = partialend ? parseInt(partialend, 10) : total - 1;
        const chunksize = (end - start) + 1;
        const readStream = fs.createReadStream(`mp3/${itemId}.mp3`, { start, end });
        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${total}`,
            'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
            'Content-Type': 'audio/mpeg'
        });
        readStream.pipe(res);
     } else {
        res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        fs.createReadStream(filePath).pipe(res);
     }
});


module.exports = router;
