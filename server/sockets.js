const socketIO = require('socket.io');
const { ListeningRoom, User } = require('./models');
const { Types } = require('mongoose');


function initSockets(io) {
    io.on('connection', async (socket) => {
        socket.on('setUserSocketId', async ({ userId }) => {
            const user = await User.findById(userId);
            user.socketId = socket.id;
            await user.save();
        });

        socket.on('joinListeningRoom', async ({ listeningRoom, user }) => {
            const defaultRoom = socket.rooms.values().next().value;
            socket.join(listeningRoom._id);
            const lr = await ListeningRoom.findById(listeningRoom._id);

            if (!lr.currentListeners.includes(Types.ObjectId(user._id))) {
                lr.currentListeners.push(Types.ObjectId(user._id));
            }
            lr.listenerMapping.set(socket.id, user._id);
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

        socket.on('sendChatMessage', async ({ message, timestamp, from }) => {
            const roomId = socket.rooms.values().next().value;

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
            const userId = lr.listenerMapping.get(socket.id);

            // remove user from listening room in database
            lr.currentListeners = lr.currentListeners.filter(u => !u.equals(userId));
            lr.listenerMapping.delete(socket.id);
            await lr.save();
            socket.to(lrId).emit('userJoinedOrLeft');
            if (lr.owner.equals(userId)) {
                io.in(lrId).emit('endListeningRoom');
                await lr.deleteOne();
            }
        });

        socket.on('sendInboxMessage', async ({ recipientId }) => {
            const currentUser = await User.findById(recipientId).lean();
            if (currentUser.socketId) {
                io.to(currentUser.socketId).emit('newInboxMessage');
            }
        });
    });
}

module.exports = initSockets;
