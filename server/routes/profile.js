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