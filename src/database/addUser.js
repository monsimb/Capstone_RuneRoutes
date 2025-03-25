// addUser.js -> pretty self explanatory

const mongoose = require('mongoose');
const User = require('./db');

// Connect to MongoDB
const url = MONGODB_URI; // change to env call



// Connect to MongoDB
mongoose.connect(url)
  .then(async () => {
    console.log('MongoDB connected successfully');

    // Create a new user object
    const newUser = new User({
      userId: 'test_user_123',  // Example user ID (replace with dynamic data)
      coordinates: { 
        lat: 45.00,  // Example latitude (replace with dynamic data)
        lon: -10.00  // Example longitude (replace with dynamic data)
      }
    });

    // Save the new user to the database
    try {
      const savedUser = await newUser.save();
      console.log('User inserted:', savedUser);
    } catch (err) {
      console.log('Error inserting user:', err);
    } finally {
      mongoose.disconnect(); // Disconnect after the operation is complete
    }
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });
