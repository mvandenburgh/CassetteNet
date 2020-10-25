const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: String,
    password: String, // will be hashed
    email: String,
    verified: Boolean,
    favoritedMixtapes: Array, // [{ mixtape: mongoose.Types.ObjectId, inRotation: Boolean }]
    followedUsers: Array, // array of other user object ids
    admin: Boolean, // true if user is an admin
    uniqueId: String, // unique alphanumeric id (length 4)
    profilePicture: { data: Buffer, contentType: String }, // raw image data for user's profile picture
});

const mixtapeSchema = new Schema({
    name: String,
    collaborators: Array, // [{ user: mongoose.Types.ObjectId, permissions: { type: String, enum: ['owner', 'viewer', 'editor'] } }]
    songs: Array, // list of youtube/spotify/whatever song ids
    coverImage: { data: Buffer, contentType: String }, // raw image data for mixtape cover image
    isPublic: Boolean,
});

const inboxMessageSchema = new Schema({
    mixtape: mongoose.Types.ObjectId, // id of the mixtape this message corresponds to
    sender: {
        type: String,
        default: 'Anonymous'
    },
    recipient: mongoose.Types.ObjectId, // object id for recipient user
    message: String, // TODO: database level string length validation?
});

const listeningRoomSchema = new Schema({
    listeners: Array, // array of user ids (users invited to listening room)
    mixtape: mongoose.Types.ObjectId, // id of the mixtape this listening room is playing
    currentSong: Number, // index of currently playing song in mixtape `songs` array
    snakeScores: Array, // [{user: mongoose.Types.ObjectId, score: Number}]
    rhythmScores: Array, // [{user: mongoose.Types.ObjectId, score: Number}]
});

module.exports = {
    InboxMessage: model('InboxMessage', inboxMessageSchema),
    ListeningRoom: model('ListeningRoom', listeningRoomSchema),
    Mixtape: model('Mixtape', mixtapeSchema),
    User: model('User', userSchema),
};
