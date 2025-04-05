require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./schema/userModel');
const url = process.env.MONGODB_URI;

// Add user function
async function addUser(userId, userName, avatarSelections, travelDistance, coordinates) {
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      console.log('User already exists.');
      return;
    }

    const newUser = new User({
      userId,
      userName,
      avatarSelections,
      travelDistance,
      coordinates
    });

    await newUser.save();
    console.log('New user added:', newUser);
  } catch (err) {
    console.error('Error:', err);
  }
}

// MongoDB connection and user addition
mongoose.connect(url)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    const coordinates = { lat: 40.7128, lon: -74.0060 }; // Example coordinates
    await addUser('test_user_123', 'John Doe', ['avatar1'], 50, coordinates);

    mongoose.disconnect(); // Disconnect after operation
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down...');
  await mongoose.disconnect();
  process.exit(0);
});
