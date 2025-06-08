const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Routes publiques
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// Routes protégées
router.get('/auth/me', auth, authController.getCurrentUser);
router.put('/auth/profile', auth, authController.updateProfile);
router.put('/auth/password', auth, authController.changePassword);

module.exports = router; 