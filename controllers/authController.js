const User = require('../models/User');
const jwt = require('jsonwebtoken');

const authController = {
  // Register user
  register: async (req, res) => {
    try {
      const { fullName, email, password, phone } = req.body;

      // Check required fields
      if (!fullName || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Create new user
      const user = new User({
        fullName,
        email,
        password,
        phone: phone || ''
      });

      await user.save();

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'Registration successful',
        token,
        user: user.toPublicJSON()
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check required fields
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: user.toPublicJSON()
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    try {
      res.json({ user: req.user.toPublicJSON() });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { fullName, phone } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (fullName) user.fullName = fullName;
      if (phone) user.phone = phone;

      await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: user.toPublicJSON()
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check required fields
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide current and new password' });
      }

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController; 