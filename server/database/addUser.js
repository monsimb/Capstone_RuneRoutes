// addUser.js -> pretty self explanatory
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./schema/userModel');
const url = process.env.MONGODB_URI;

// Add user
export async function addUser(userId, userName, avatarSelections, travelDistance) {
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

addUser('id', 'name', 'avatar', 'travelDistance');

// Connect to MongoDB

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected successfully');

    // Call addUser function with example data
    await addUser('test_user_123', 'John Doe', 'avatar1', 50);

    mongoose.disconnect(); // Disconnect after operation
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });