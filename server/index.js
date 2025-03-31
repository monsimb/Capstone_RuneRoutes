// index.js

require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');

const cors = require('cors');
const User = require('./database/schema/userModel'); 

const app = express();
app.use(cors());
app.use(express.json());

const url = process.env.MONGODB_URI;
console.log("uri"+url);

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('DB connection error:', err));

// Create an API route to add a user
app.post('/addUser', async (req, res) => {
  const { userId, userName, avatarSelections, travelDistance } = req.body;
  
  try {
    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ userId, userName, avatarSelections, travelDistance });
    await newUser.save();
    
    res.status(201).json({ message: 'User added successfully', newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error adding user', error });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
