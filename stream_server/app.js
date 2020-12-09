const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const cors = require('cors');
const NodeMediaServer = require('node-media-server');
const socketIOClient = require('socket.io-client');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;

const SERVER_ROOT_URL = process.env.SERVER_ROOT_URL || 'http://localhost:5000';

const socket = socketIOClient(SERVER_ROOT_URL);

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
        ffmpeg: process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
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
app.use('/stream', proxy(`http://localhost:${process.env.MEDIA_PORT || 8888}/`));

app.post('/startStream', async (req, res) => {
    const { type, id, index, listeningRoomId } = req.body;
    if (!type || !id || (!index && index !== 0) || !listeningRoomId) return res.status(400).send('invalid request');
    const filename = Date.now();
    let writeStream;
    if (type === 'youtube') {
        writeStream = ytdl(`http://www.youtube.com/watch?v=${id}`, { quality: 'lowestaudio' }).pipe(fs.createWriteStream(path.join(__dirname, `mp3/${filename}.mp3`)));
    } else if (type === 'soundcloud') {
        writeStream = (await scdl.download(`https://api.soundcloud.com/tracks/${id}`)).pipe(fs.createWriteStream(path.join(__dirname, `mp3/${filename}.mp3`)));
    } else {
        return res.status(400).send('invalid request.');
    }
    writeStream.on('finish', () => {
        // spawn ffmpeg process to start live stream
        const ffmpegStreamProcess = child_process.spawn('ffmpeg', [`-re -i "${path.join(__dirname, `mp3/${filename}.mp3`)}" -c:v libx264 -preset veryfast -tune zerolatency -c:a aac -ar 44100 -f flv rtmp://localhost/live/${filename}`], { shell: true });

        res.json(filename);
        // ffmpegStreamProcess.stderr.on('data', (data) => {
        //     const dataString = data.toString();
        //     if (dataString.includes('[INFO] [rtmp play] Join stream.')) {
        //         socket.emit('confirmSongChanged', { startedAt: streamStartedAt, index, listeningRoomId });
        //     }
        // });
        // remove mp3 file and streaming files after stream is over
        ffmpegStreamProcess.on('close', (code) => {
            fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
            fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
        });
    }); 
});

app.get('/', (req, res) => res.sendFile('index.html', { root: path.join(__dirname, 'public') }));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Stream server running on port ${PORT}...`));
