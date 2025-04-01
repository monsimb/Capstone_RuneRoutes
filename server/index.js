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
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// API route to add a user
app.post('/addUser', async (req, res) => {
  try {
    const { userId, userName, avatarSelections, lat, lon } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Add new user
    const newUser = new User({
      userId,
      userName,
      avatarSelections,
      coordinates: { lat, lon }
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });

  } catch (err) {
    console.error('❌ Error adding user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Render requires listening on 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
