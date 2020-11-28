const socketIO = require('socket.io');
const { ListeningRoom } = require('./models');
const { Types } = require('mongoose');


function initSockets(io) {
    io.on('connection', socket => {
        socket.on('joinListeningRoom', async ({ listeningRoom, user }) => {
            const defaultRoom = socket.rooms.values().next().value;
            socket.join(listeningRoom._id);
            const lr = await ListeningRoom.findById(listeningRoom._id);

            if (!lr.currentListeners.includes(Types.ObjectId(user._id))) {
                lr.currentListeners.push(Types.ObjectId(user._id));
            }
            lr.listenerMapping.set(socket.id, user._id);

            await lr.save();
            socket.emit('userJoinedOrLeft');
            socket.to(listeningRoom._id).to(defaultRoom).emit('userJoinedOrLeft');
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

            // remove user from listening room in database
            lr.currentListeners = lr.currentListeners.filter(u => !u.equals(lr.listenerMapping.get(socket.id)));
            lr.listenerMapping.delete(socket.id);
            await lr.save();
            socket.to(lrId).emit('userJoinedOrLeft');
        });
    });
}

module.exports = initSockets;
