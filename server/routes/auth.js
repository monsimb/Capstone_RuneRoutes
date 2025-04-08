const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');
const router = express.Router();
require('dotenv').config({ path: '../.env' });


// Auth0 JWT verification middleware
const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  });

// Example route to sync user data
router.post('/login', checkJwt, async (req, res) => {
    try {
      // Pull user info from the token
      const { sub, nickname, picture } = req.auth.payload;
  
      // Call addUser function
      // await addUser(sub, nickname, [picture]); bla bla bla
  
      res.json({ message: 'User synced successfully', userId: sub });
    } catch (error) {
      console.error('Error syncing user:', error);
      res.status(500).json({ error: 'Error syncing user' });
    }
  });
  
  module.exports = router;