const { Types } = require('mongoose');
const { ListeningRoom, User } = require('./models');


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

            if (!lr.currentListeners.includes(Types.ObjectId(user._id))) {
                lr.currentListeners.push(Types.ObjectId(user._id));
            }
            lr.chatMessages.push({
                message: `${user.username} joined the room!`,
                timestamp: Date.now(),
                from: { username: '#ChatBot' }, // will always be unique since usernames aren't allowed to start with #
            });
            await lr.save();
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

            // remove user from listening room in database
            lr.currentListeners = lr.currentListeners.filter(u => !u.equals(user._id));
            await lr.save();
            socket.to(lrId).emit('userJoinedOrLeft');
            if (lr.owner.equals(user._id)) {
                io.in(lrId).emit('endListeningRoom');
                await lr.deleteOne();
            }
        });

        socket.on('sendInboxMessage', async ({ recipientId }) => {
            const userReceivingMessage = await User.findById(recipientId).lean();
            if (userReceivingMessage && userReceivingMessage.socketId) {
                io.to(userReceivingMessage.socketId).emit('newInboxMessage'); // notify user that they have a new message
            }
        });

        socket.on('playSong', async ({ index, timestamp }) => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            if (listeningRoom.owner.equals(user._id)) {
                io.in(roomId).emit('playSong', { index, timestamp });
            }
        });

        socket.on('pauseSong', async ({ timestamp }) => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            if (listeningRoom.owner.equals(user._id)) {
                io.in(roomId).emit('pauseSong', { timestamp });
            }
        });

        socket.on('seekSong', async ({ timestamp }) => {
            const roomId = socket.rooms.values().next().value;
            const listeningRoom = await ListeningRoom.findById(roomId);

            if (listeningRoom.owner.equals(user._id)) {
                io.in(roomId).emit('seekSong', { timestamp });
            }
        });
    });
}

module.exports = initSockets;
