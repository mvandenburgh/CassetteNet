const fs = require('fs');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');
const bodyParser = require('body-parser');
const cors = require('cors');
const NodeMediaServer = require('node-media-server');
const scdl = require('soundcloud-downloader').default;
const YoutubeMp3Downloader = require('youtube-mp3-downloader');
const AudioContext = require('web-audio-api').AudioContext;
const MusicTempo = require('music-tempo');
const ffmpeg = require('fluent-ffmpeg');
const { v4: uuidv4 } = require('uuid');

const runningStreams = new Map();


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
    const { type, id, getTempo } = req.body;
    if (!type || !id) return res.status(400).send('invalid request');
    const filename = uuidv4();
    if (type === 'youtube') {
        const YD = new YoutubeMp3Downloader({
            'ffmpegPath': process.env.FFMPEG_PATH || '/usr/bin/ffmpeg',
            'outputPath': path.join(__dirname, 'mp3'),
            'youtubeVideoQuality': 'lowestaudio',
            'queueParallelism': 1,
            'progressTimeout': 2000,
            'allowWebm': false
        });
        YD.download(id, `${filename}.mp3`);
        // YD.on('error', (err) => res.status(500).send(err));
        YD.on('finished', (err, data) => {
            if (err) {
                return res.status(500).send(err)
            } else {
                let tempo;
                if (getTempo) {
                    const data = fs.readFileSync(path.join(__dirname, `mp3/${filename}.mp3`));

                    // perform tempo detection
                    const context = new AudioContext();
                    context.decodeAudioData(data, (buffer) => {
                        const audioData = [];
                        if (buffer.numberOfChannels == 2) {
                            const channel1Data = buffer.getChannelData(0);
                            const channel2Data = buffer.getChannelData(1);
                            for (let i = 0; i < channel1Data.length; i++) {
                                audioData.push((channel1Data[i] + channel2Data[i]) / 2);
                            }
                        } else {
                            audioData = buffer.getChannelData(0);
                        }
                        const tempoData = new MusicTempo(audioData);

                        tempo = tempoData.tempo;

                        res.json({ listeningRoomPlaybackId: filename, tempo });

                        const command = ffmpeg()
                            .input(`${path.join(__dirname, `mp3/${filename}.mp3`)}`)
                            .native()
                            .format('flv')
                            .save(`rtmp://localhost/live/${filename}`)
                            .on('error', (err) => {
                                console.log(err);
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            })
                            .on('end', () => {
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            });
                        runningStreams.set(filename, command);
                    });
                } else {
                    // send response back to client
                    res.json({ listeningRoomPlaybackId: filename });
                    const command = ffmpeg()
                            .input(`${path.join(__dirname, `mp3/${filename}.mp3`)}`)
                            .native()
                            .format('flv')
                            .save(`rtmp://localhost/live/${filename}`)
                            .on('progress', p => undefined)
                            .on('error', (err) => {
                                console.log(err);
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            })
                            .on('end', () => {
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            });
                    runningStreams.set(filename, command);
                }
                
            }
        });
    } 
    else if (type === 'soundcloud') {
        const writeStream = (await scdl.download(`https://api.soundcloud.com/tracks/${id}`)).pipe(fs.createWriteStream(path.join(__dirname, `mp3/${filename}.mp3`)));
        writeStream.on('finish', () => {
            // use a boolean in the request body to determine whether we want to calculate tempo.
            // this operation is expensive (makes the request rtt several seconds longer), so the client
            // should only do this once per song and save the tempos for future use.
            if (getTempo) {
                const data = fs.readFileSync(path.join(__dirname, `mp3/${filename}.mp3`));

                // perform tempo detection
                const context = new AudioContext();
                context.decodeAudioData(data, (buffer) => {
                    const audioData = [];
                    if (buffer.numberOfChannels == 2) {
                        const channel1Data = buffer.getChannelData(0);
                        const channel2Data = buffer.getChannelData(1);
                        for (let i = 0; i < channel1Data.length; i++) {
                            audioData.push((channel1Data[i] + channel2Data[i]) / 2);
                        }
                    } else {
                        audioData = buffer.getChannelData(0);
                    }
                    const tempoData = new MusicTempo(audioData);
                    res.json({ listeningRoomPlaybackId: filename, tempo: tempoData.tempo });

                    const command = ffmpeg()
                            .input(`${path.join(__dirname, `mp3/${filename}.mp3`)}`)
                            .native()
                            .format('flv')
                            .save(`rtmp://localhost/live/${filename}`)
                            .on('error', (err) => {
                                console.log(err);
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            })
                            .on('end', () => {
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            });
                    runningStreams.set(filename, command);
                });
            } else {
                // send response back to client3
                res.json({ listeningRoomPlaybackId: filename });

                const command = ffmpeg()
                            .input(`${path.join(__dirname, `mp3/${filename}.mp3`)}`)
                            .native()
                            .format('flv')
                            .save(`rtmp://localhost/live/${filename}`)
                            .on('error', (err) => {
                                console.log(err);
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            })
                            .on('end', () => {
                                fs.unlink(path.join(__dirname, `mp3/${filename}.mp3`), () => console.log(`Removed file '${path.join(__dirname, `mp3/${filename}.mp3`)}'.`));
                                fs.rmdir(path.join(__dirname, `mp3/live/${filename}`), { recursive: true }, (e) => console.log(`Removed folder '${path.join(__dirname, `mp3/live/${filename}`)}'.`));
                            });
                runningStreams.set(filename, command);
            }
        });
    } 
    else {
        return res.status(400).send('invalid request.');
    }
});

app.delete('/stopStream/:id', (req, res) => {
    const { id } = req.params;
    const ffmpegProcess = runningStreams.get(req.params.id);
    if (ffmpegProcess) {
        runningStreams.get(req.params.id).kill();
        res.send(req.params.id);
        runningStreams.delete(req.params.id);
    } else {
        res.status(404).send('stream not found.');
    }
    
});

app.get('/', (req, res) => res.sendFile('index.html', { root: path.join(__dirname, 'public') }));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Stream server running on port ${PORT}...`));
