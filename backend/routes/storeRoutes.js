const express = require('express');
const router = express.Router();
const { getStoresForUser, getStoreById, getStoreReviews } = require('../controllers/storeController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Only Normal Users can access store lists for submitting ratings
router.get('/', authenticateToken, requireRole('Normal User'), getStoresForUser);
router.get('/:id', authenticateToken, requireRole('Normal User'), getStoreById);
router.get('/:id/reviews', authenticateToken, requireRole('Normal User'), getStoreReviews);

module.exports = router;
