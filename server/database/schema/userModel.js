// userModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  avatarSelections: { type: [Number], default: [0,0,0,0,0] },
  travelDistance: { type: Number, default: 0 },
  fog: { // Stores last saved polygon
    //GeoJSON
    type: mongoose.Schema.Types.Mixed, // Mixed because it can be polygon or multipolygon (with holes)
    default: null
  }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
