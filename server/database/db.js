require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const url = process.env.MONGODB_URI; // Ensure your .env file contains MONGODB_URI

if (!url) {
  console.error('MONGODB_URI not found. Ensure .env is configured.');
  process.exit(1);
}

// Connect to MongoDB and specify database in URI
mongoose.connect(url)
  .then(() => console.log('MongoDB Database connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Define User Schema
const userSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  userName: { type: String, required: true },
  avatarSelections: [String],
  coordinates: {
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  }
}, { timestamps: true });

// Create User Model
const User = mongoose.model('User', userSchema);

// Ensure database creation by inserting a dummy record (if none exists)
async function ensureDatabase() {
  try {
    const existingUser = await User.findOne();
    if (!existingUser) {
      await User.create({
        userId: "test_user",
        userName: "Test User",
        avatarSelections: ["default"],
        coordinates: { lat: 0, lon: 0 }
      });
      console.log('✅ Database & Collection initialized with dummy data');
    } else {
      console.log('✅ Database & Collection already exist');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Run database initialization
ensureDatabase();

module.exports = User;
