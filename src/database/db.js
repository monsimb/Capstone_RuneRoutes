// db.js (or mongoose setup file)


// MUST BE MOVED TO ENV -> change user and password before deployment ;(
MONGODB_URI = "mongodb+srv://db-user:QJF1Q92KFh8Uynar@cluster0.us0i8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//
// username password database name
//


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect to MongoDB
const url = MONGODB_URI; // change to env call

// connect to MongoDB
mongoose.connect(url)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// schema for user data
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },  // Store user ID (from Auth0)
  coordinates: {
    lat: { type: Number, required: true },  // Latitude
    lon: { type: Number, required: true }   // Longitude
  }
});

// model for the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
