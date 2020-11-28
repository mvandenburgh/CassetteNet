const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const mongoosePartialTextSearch = require('mongoose-partial-search');


const userSchema = new Schema({
  username: {
    type: String,
    searchable: true,
  },
  hash: String,
  salt: String,
  email: {type: String, unique: true},
  verified: Boolean,
  token: String, // email verification token
  favoritedMixtapes: Array, // [{ mixtape: mongoose.Types.ObjectId, inRotation: Boolean }]
  followedUsers: Array, // array of other user object ids
  admin: Boolean, // true if user is an admin
  strategy: { // whether or not this user signed up w/ local strategy (true) or oauth (false)
    type: String,
    default: 'local'
  },
  uniqueId: {
    type: Number,
    get: id => id.toString(36).padStart(4, '0').toUpperCase(), // convert to alphanumeric string
    searchable: true,
  },
  profilePicture: { // raw image data for user's profile picture
    type: {
      data: Buffer,
      contentType: String
    },
    select: false
  },
}, { timestamps: true, toJSON: { getters: true } });


userSchema.plugin(passportLocalMongoose);
userSchema.plugin(AutoIncrement, { inc_field: 'uniqueId' });
userSchema.index({ username: 'text' });
userSchema.plugin(mongoosePartialTextSearch);

const songSchema = new Schema({
  name: {
    type: String,
    searchable: true,
  },
  id: String,
  coverImage: String,
  type: String,
  duration: Number,
  playbackUrl: String,
});

const mixtapeSchema = new Schema({
  name: {
    type: String,
    searchable: true,
  },
  collaborators: Array, // [{ user: mongoose.Types.ObjectId, permissions: { type: String, enum: ['owner', 'viewer', 'editor'] } }]
  songs: [songSchema],
  coverImage: { 
    type: {
      data: Buffer,
      contentType: String, // raw image data for mixtape cover image
    },
    select: false,
  },
  isPublic: Boolean,
});

mixtapeSchema.index({ name: 'text' });
mixtapeSchema.plugin(mongoosePartialTextSearch);
songSchema.plugin(mongoosePartialTextSearch);

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
  currentListeners: Array, // array of user ids (users invited to listening room)
  listenerMapping: Map,
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
