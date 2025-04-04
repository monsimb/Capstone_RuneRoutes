// userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  avatarSelections: [{ type: String }],
  travelDistance: Number,
  coordinates: {
    lat: Number,
    lon: Number,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
