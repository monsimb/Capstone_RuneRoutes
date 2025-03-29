// db.js (or mongoose setup file)
require('dotenv').config();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const url = process.env.MONGODB_URI; // changed to env call

if(!url) {
  console.error('MONGODB URI not located. Check if you have setup .env file (root directory) with the MONGODB_URI');
  process.exit(1);
}

// connect to MongoDB
mongoose.connect(url, {
  userNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// schema for user data
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },  // Store user ID (from Auth0)
  userName: { type: String, required: true, unique: true }, // Username (from Auth0)
  avatarSelections: [String],
  coordinates: {
    lat: { type: Number, required: true },  // Latitude
    lon: { type: Number, required: true }   // Longitude
  }
}, { timestamps: true });

// model for the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
