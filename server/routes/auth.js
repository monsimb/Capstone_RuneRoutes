const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const router = express.Router();
require('dotenv').config({ path: '../.env' });
const User = require('../database/schema/userModel.js'); // Import User model

// Auth0 JWT verification middleware
const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  });

// Test route for verifying tokens
router.get('/protected', checkJwt, (req, res) => {
  res.send(` Hello ${req.auth.payload.sub}, you are authenticated`);
});

// Get userId for getting profile
router.get('/users/:userId', checkJwt, async (req, res) => {
  try {
    const { userId } = req.params;
    const userProfile = await User.findOne({ userId });

    if(!userProfile) {
      return res.status(404). json({ message: 'User not found'});
    }
    res.status(200).json(userProfile);
  } catch (err) {
    console.error('Error retrieving profile', err.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


// API route to add a user
// POST /users - Add a new user
router.post('/users', async (req, res) => {
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
      { userId },
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

router.post('/location', checkJwt, async (req, res) => {
  try {
    const {userId, lat, lon} = req.body;

    if(!userId || lat === undefined || lon === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const updatedUser = await User.findOneAndUpdate(
      {userId},
      { 
        $set: {
          coordinates: {
            lat: parseFloat(lat),
            lon: parseFloat(lon)
          }
        }
      },
      { new: true }
    );

    if(!updatedUser) {
      return res.status(404).json({message: `User not found`});
    }

    res.status(200).json({
      message: 'Coordinates updated',
      coordinates: updatedUser.coordinates
    });
  } catch(err) {
    console.error('Error updating location:', err.message);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

router.post('/update-avatar', checkJwt, async (req, res) => {
  try {
    const {userId, avatarSelections} = req.body;

    if(!userId || !Array.isArray(avatarSelections)) {
      return res.status(400).json({ message: 'Missing or invalid fields' });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { avatarSelections },
      { new: true }
    );
    console.log(avatarSelections);
    if(!updatedUser) {
      return res.status(404).json({message: `User not found`});
    }

    res.status(200).json({
      message: 'Avatar updated successfully',
      coordinates: updatedUser.avatarSelections
    });
  } catch(err) {
    console.error('Error updating avatar:', err.message);
    res.status(500).json({error: 'Internal Server Error'});
  }
});
  
module.exports = router;