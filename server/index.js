
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Allows frontend to connect



const app = express();
app.use(express.json({ limit: '10mb' })); // Middleware to parse JSON data
app.use(cors());  // Enable CORS (important for frontend requests)

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI) // CONNECTS TO MONGO
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

const authRoutes = require('./routes/auth'); // LINKS AUTH WHICH VERIFIES THEN UPDATES USER INFO
app.use('/auth', authRoutes);

app.get("/auth", (req, res) => {
  res.send("Auth is up and fresh");
});  


app.get("/", (req, res) => {
  res.send("Backend is up and fresh");
});
  



// app.listen only needs to be called twice. Removed and this is note to self