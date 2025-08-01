const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  }
);

// Get current user
router.get('/user', ensureAuthenticated, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    role: req.user.role,
    lastLogin: req.user.lastLogin
  });
});

// Logout route
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error destroying session' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out successfully' });
    });
  });
});

// Check authentication status
router.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      authenticated: true, 
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Update device information
router.post('/device', ensureAuthenticated, async (req, res) => {
  try {
    const { deviceId, deviceName, ipAddress } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check if device already exists
    const existingDevice = user.devices.find(device => device.deviceId === deviceId);
    
    if (existingDevice) {
      existingDevice.lastAccess = new Date();
      existingDevice.ipAddress = ipAddress;
    } else {
      user.devices.push({
        deviceId,
        deviceName,
        lastAccess: new Date(),
        ipAddress
      });
    }
    
    await user.save();
    res.json({ message: 'Device information updated' });
  } catch (error) {
    console.error('Error updating device info:', error);
    res.status(500).json({ message: 'Error updating device information' });
  }
});

// Get user devices
router.get('/devices', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ message: 'Error fetching devices' });
  }
});

module.exports = router;