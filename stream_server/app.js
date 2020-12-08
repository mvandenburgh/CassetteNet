const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const NodeMediaServer = require('node-media-server');
const ytdl = require('ytdl-core');

// configuration for node-media-server
const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 60,
        ping_timeout: 30
    },
    http: {
        port: process.env.MEDIA_PORT || 8888,
        mediaroot: path.join(__dirname, 'mp3'),
        allow_origin: '*'
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
            {
                app: 'live',
                hls: true,
                hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
                dash: true,
                dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
            }
        ]
    }
};

// start node_media_server
const node_media_server = new NodeMediaServer(config);
node_media_server.run();

// configure express server
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.post('/startStream', (req, res) => {
    const { type, id } = req.body;
    const filename = Date.now();
    if (type === 'youtube') {
        const writeStream = ytdl(`http://www.youtube.com/watch?v=${id}`, { quality: 'lowestaudio' }).pipe(fs.createWriteStream(path.join(__dirname, `mp3/${filename}.mp3`)));
        writeStream.on('finish', () => {
            const ffmepgStreamProcess = child_process.spawn('ffmpeg', [`-re -i "${path.join(__dirname, `mp3/${filename}.mp3`)}" -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/${filename}`], { shell: true });
            res.json(filename);

            // remove mp3 file and streaming files after stream is over
            ffmepgStreamProcess.on('close', (code) => {
                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
            });
        });
    } else if (type === 'soundcloud') {
        res.send('not implemented yet.');
    } else {
        res.status(400).send('invalid request.');
    }
});

const PORT = process.env.EXPRESS_PORT || 5001;

app.listen(PORT, () => console.log(`Stream server running on port ${PORT}...`));

