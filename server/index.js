require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);


const url = process.env.MONGODB_URI; // changed to env call


mongoose.connect(url) 
  // NO useNewUrlParser & useUnifiedTopology, they are deprecated
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

app.use(cors()); // Middleware. Verifies token
app.use(express.json());

// Simple test route - Not working rn
app.get('/', (req, res) => {
    res.send('Hello from Express!');
  });
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });