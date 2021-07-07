const { Types } = require('mongoose');
const axios = require('axios');
const { ListeningRoom, User } = require('./models');

let STREAM_SERVER_ROOT_URL;
try {
    STREAM_SERVER_ROOT_URL = new URL(process.env.STREAM_SERVER_ROOT_URL).href;
} catch (err) {
    STREAM_SERVER_ROOT_URL = new URL('http://localhost:5001/').href;
}

let STREAM_SERVER_STREAMING_URL;
try {
    STREAM_SERVER_STREAMING_URL = new URL(process.env.STREAM_SERVER_STREAMING_URL).href;
} catch (err) {
    STREAM_SERVER_STREAMING_URL = new URL('http://localhost:5001/').href;
}

function stopCurrentStream(listeningRoom) {
    console.log(`attempting to stop stream ${listeningRoom.mixtape.songs[listeningRoom.currentSong].listeningRoomStreamId}...`);
    axios.delete(new URL(`/stopStream/${listeningRoom.mixtape.songs[listeningRoom.currentSong].listeningRoomStreamId}`, STREAM_SERVER_ROOT_URL).href)
        .catch(err => console.log(`failed to stop stream ${listeningRoom.mixtape.songs[listeningRoom.currentSong].listeningRoomStreamId}. it may not exist.`))
        .then(() => console.log(`successfully stopped stream ${listeningRoom.mixtape.songs[listeningRoom.currentSong].listeningRoomStreamId}.`));
}

function initSockets(io) {
    io.on('connection', async (socket) => {
        const { user } = socket.request; // user object from passport, generated from `passportSocketIo.authorize` in app.js

        socket.on('setUserSocketId', async () => {
            const userDb = await User.findById(user._id);
            userDb.socketId = socket.id;
            await userDb.save();
        });

        socket.on('joinListeningRoom', async ({ listeningRoom }) => {
            const defaultRoom = socket.rooms.values().next().value;
            socket.join(listeningRoom._id);
            const lr = await ListeningRoom.findById(listeningRoom._id);

            if (!lr.currentListeners.map(l => l.user).includes(Types.ObjectId(user._id))) {
                lr.currentListeners.push(Types.ObjectId(user._id));
                await lr.save();
            }
            lr.chatMessages.push({
                message: `${user.username} joined the room!`,
                timestamp: Date.now(),
                from: { username: '#ChatBot' }, // will always be unique since usernames aren't allowed to start with #
            });
            await lr.save();
            if (!lr.startedAt) {
                lr.startedAt = Date.now() / 1000 + 8;
                await lr.save();
                lr.wasAt = 0;
                await lr.save();
            }
            socket.emit('userJoinedOrLeft');
            socket.to(listeningRoom._id).to(defaultRoom).emit('userJoinedOrLeft');
            socket.to(listeningRoom._id).to(defaultRoom).emit('newChatMessage', lr.chatMessages);
            socket.leave(defaultRoom); // leave the default room that socket.io creates
        });

        socket.on('sendChatMessage', async ({ message, timestamp }) => {
            const roomId = socket.rooms.values().next().value;

            const from = { user: user._id, username: user.username };
            const listeningRoom = await ListeningRoom.findById(roomId);
            listeningRoom.chatMessages.push({ message, timestamp, from });

            await listeningRoom.save();

            io.in(roomId).emit('newChatMessage', listeningRoom.chatMessages);
        });

        socket.on('disconnecting', async () => {
            // get id of listening room user disconnected from
            const lrIds = Array.from(socket.rooms).filter(room => Types.ObjectId.isValid(room));
            if (!lrIds || lrIds.length === 0) return;
            const lrId = lrIds[0];
            const lr = await ListeningRoom.findById(lrId);
            if (lr) {
                // remove user from listening room in database
                lr.currentListeners = lr.currentListeners.filter(u => !u.equals(user._id));
                lr.chatMessages.push({
                    message: `${user.username} has left the room.`,
                    timestamp: Date.now(),
                    from: { username: '#ChatBot' }, // will always be unique since usernames aren't allowed to start with #
                });
                await lr.save();
                socket.to(lrId).emit('userJoinedOrLeft');
                if (lr.owner.equals(user._id)) {
                    io.in(lrId).emit('endListeningRoom'); // notify all connected clients that the session is about to end
                    stopCurrentStream(lr); // end the currently streaming song
                    lr.deleteOne(); // delete the listening room
                }
            }

            const userDb = await User.findById(user._id);
            userDb.set('socketId', null);
            await userDb.save();
        });

        socket.on('sendInboxMessage', async ({ recipientId }) => {
            const userReceivingMessage = await User.findById(recipientId).lean();
            if (userReceivingMessage && userReceivingMessage.socketId) {
                io.to(userReceivingMessage.socketId).emit('newInboxMessage'); // notify user that they have a new message
            }
        });

        socket.on('changeSong', async (index) => {
            console.log('changeSong ' + index)
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);
            if (listeningRoom && listeningRoom.owner && listeningRoom.owner.equals(user._id)) {
                if (listeningRoom.mixtape.songs[listeningRoom.currentSong].listeningRoomStreamId) { // stop current stream if it exists
                    stopCurrentStream(listeningRoom);
                }
                if (listeningRoom.rhythmScores && listeningRoom.rhythmScores.size > 0) {
                    let max = 0;
                    let winners = [];
                    for ([userId, score] of listeningRoom.rhythmScores) {
                        const scoreUser = await User.findById(userId).lean();
                        if (scoreUser) {
                            console.log(score, max);
                            if (score > max) {
                                winners = [{user: userId, username: scoreUser.username}];
                                max = score;
                            } else if (score === max) {
                                winners.push({user: userId, username: scoreUser.username});
                            }
                        }
                    }
                    let message;
                    if (winners.length === 1) {
                        message = `${winners[0].username} won the rhythm game!`;
                    } else if (winners.length === 0) {
                        message = 'No one wins the rhythm game!';
                    } else {
                        message = 'It was a tie between '
                        for (let i = 0; i < winners.length; i++) {
                            message += winners[i].username;
                            if (i < winners.length-1) {
                                message += ', ';
                            }
                        }
                        message += '!';
                    }
                    listeningRoom.chatMessages.push({ message, timestamp: Date.now(), from: { username: '#ChatBot' }}); // will always be unique since usernames aren't allowed to start with #
                    await listeningRoom.save();
                }
                listeningRoom.currentSong = index;
                await listeningRoom.save();
                if (listeningRoom.rhythmGameQueue.length > 0) {
                    io.in(roomId).emit('rhythmGameAboutToBegin');
                }
                let stream;

                // only request tempo of song if:
                //   1) there is at least one person in the rhythm game queue AND
                //   2) the tempo hasn't already been calculated prior
                const getTempo = listeningRoom.rhythmGameQueue.length > 0 && !listeningRoom.mixtape.songs[index].tempo;

                try {
                    stream = await axios.post(new URL('/startStream', STREAM_SERVER_ROOT_URL).href,
                        {
                            type: listeningRoom.mixtape.songs[index].type,
                            id: listeningRoom.mixtape.songs[index].id,
                            getTempo,
                        }
                    );
                } catch (err) {
                    console.log(err.message);
                    return;
                }
                const { listeningRoomPlaybackId, tempo } = stream.data;
                const listeningRoomPlaybackUrl = new URL(`/stream/live/${listeningRoomPlaybackId}.flv`, STREAM_SERVER_STREAMING_URL).href;
                listeningRoom.mixtape.songs[index].listeningRoomPlaybackUrl = listeningRoomPlaybackUrl;
                await listeningRoom.save();
                listeningRoom.mixtape.songs[index].listeningRoomStreamId = listeningRoomPlaybackId;
                await listeningRoom.save();
                if (tempo) {
                    listeningRoom.mixtape.songs[index].tempo = tempo;
                    await listeningRoom.save();
                }
                listeningRoom.markModified('currentListeners');
                await listeningRoom.save();
                listeningRoom.markModified('mixtape.songs');
                await listeningRoom.save();
                listeningRoom.startedAt = (Date.now() / 1000) + 8; // its usually off by about 4 seconds
                await listeningRoom.save();
                listeningRoom.wasAt = 0;
                await listeningRoom.save();

                io.in(roomId).emit('newChatMessage', listeningRoom.chatMessages);
                listeningRoom.rhythmScores = new Map();
                await listeningRoom.save();
                listeningRoom.snakeScores = new Map();
                await listeningRoom.save();
                listeningRoom.markModified('rhythmScores');
                await listeningRoom.save();
                listeningRoom.markModified('snakeScores');
                await listeningRoom.save();
                io.in(roomId).emit('changeSong', { index, url: listeningRoomPlaybackUrl });
            }
        });

        socket.on('queueRhythmGame', async () => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            if (!listeningRoom.rhythmGameQueue.includes(Types.ObjectId(user._id))) {
                listeningRoom.rhythmGameQueue.push(Types.ObjectId(user._id));
                await listeningRoom.save();
            }
        });

        socket.on('dequeueRhythmGame', async () => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            listeningRoom.rhythmGameQueue = listeningRoom.rhythmGameQueue.filter(u => !u.equals(user._id));
            await listeningRoom.save();
        });

        socket.on('rhythmScoreChange', async (changeBy) => {
            console.log(`Change ${user.username}'s (${user._id.toString()}) rhythm score by ${changeBy}`)
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            const userScore = listeningRoom.rhythmScores.get(user._id.toString());
            if (userScore) {
                listeningRoom.rhythmScores.set(user._id.toString(), userScore + changeBy);
            } else {
                listeningRoom.rhythmScores.set(user._id.toString(), changeBy);
            }
            await listeningRoom.save();
            io.in(roomId).emit('rhythmScoreChange');
        });

        socket.on('snakeScoreChange', async (changeBy) => {
            console.log(`Change ${user.username}'s (${user._id.toString()}) snake score by ${changeBy}`)
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            const userScore = listeningRoom.snakeScores.get(user._id.toString());
            if (userScore) {
                listeningRoom.snakeScores.set(user._id.toString(), userScore + changeBy);
            } else {
                listeningRoom.snakeScores.set(user._id.toString(), changeBy);
            }
            await listeningRoom.save();
            io.in(roomId).emit('snakeScoreChange');
        });
    });
}

module.exports = initSockets;
