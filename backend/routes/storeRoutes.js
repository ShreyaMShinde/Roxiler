const express = require('express');
const router = express.Router();
const { getStoresForUser } = require('../controllers/storeController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Only Normal Users can access store lists for submitting ratings
router.get('/', authenticateToken, requireRole('Normal User'), getStoresForUser);

module.exports = router;
