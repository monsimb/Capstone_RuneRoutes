// userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  avatarSelections: [{ type: [Number] }],
  travelDistance: { type: Number, default: 0 },
  coordinates: {
    lat: Number,
    lon: Number,
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
