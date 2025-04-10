
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Allows frontend to connect

const User = require('./database/schema/userModel.js'); // Import User model

const app = express();
app.use(express.json()); // Middleware to parse JSON data
app.use(cors());  // Enable CORS (important for frontend requests)

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit if unable to connect
  });

// API route to add a user
// POST /users - Add a new user
app.post('/users', async (req, res) => {
  try {
    const { userId, userName, avatarSelections, travelDistance, lat, lon } = req.body;

    if(!userId || !userName || lat === undefined || lon === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Ensure avatarSelections is an array
    const avatarsArray = Array.isArray(avatarSelections)
      ? avatarSelections
      : [avatarSelections];

    // Parse coordinates to numbers
    const coordinates = {
      lat: parseFloat(lat),
      lon: parseFloat(lon),
    };

    const updatedUser = await User.findOneAndUpdate(
      { userID },
      {
        userId,
        userName,
        avatarSelections: avatarsArray,
        travelDistance,
        coordinates: {lat: parseFloat(lat), lon: parseFloat(lon)}
      },
      {
        new: true,
        upsert: true, // This will create new if it doesn't exist yet
      }
    );

    res.status(200).json({ // Success
      message: 'User created/updated successfully',
      user: updatedUser
    });

  } catch (err) {
    console.error('Error adding/updating user:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.listen only needs to be called twice. Removed and this is note to self