const express = require('express');
const router = express.Router();
const { submitRating, modifyRating } = require('../controllers/ratingController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.use(requireRole('Normal User'));

router.post('/', submitRating);
router.put('/', modifyRating);

module.exports = router;
