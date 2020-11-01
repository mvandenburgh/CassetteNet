const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  passwordHash: String,
  passwordSalt: String,
  email: String,
  verified: Boolean,
  favoritedMixtapes: Array, // [{ mixtape: mongoose.Types.ObjectId, inRotation: Boolean }]
  followedUsers: Array, // array of other user object ids
  admin: Boolean, // true if user is an admin
  uniqueId: String, // unique alphanumeric id (length 4)
  profilePicture: { data: Buffer, contentType: String }, // raw image data for user's profile picture
});

userSchema.methods.setPassword = function(password) {
  console.log(password);
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

userSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

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
  currentListeners: Array, // array of user ids (users invited to listening room)
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
