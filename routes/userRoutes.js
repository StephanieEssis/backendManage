const express = require('express');
const userController = require('../controllers/userController');
const verifyUserToken = require('../middlewares/verifyUserToken');

const router = express.Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', verifyUserToken, userController.getProfile);
router.put('/profile', verifyUserToken, userController.updateProfile);
router.put('/password', verifyUserToken, userController.changePassword);

module.exports = router;