const express = require('express');
const router = express.Router();
const { register, login, firebaseLogin, updatePassword } = require('../controllers/authController');
const { validateRegister, validatePasswordUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public endpoints
router.post('/register', validateRegister, register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);

// Protected endpoints
router.put('/update-password', authenticateToken, validatePasswordUpdate, updatePassword);

module.exports = router;
