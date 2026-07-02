const express = require('express');
const router = express.Router();
const {
  getStats,
  createUser,
  getUsersList,
  getStoresList,
  getAllUsersDetails,
} = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const { validateUserCreate } = require('../middleware/validation');

// All routes here are protected and require 'System Administrator' role
router.use(authenticateToken);
router.use(requireRole('System Administrator'));

router.get('/stats', getStats);
router.post('/users', validateUserCreate, createUser);
router.get('/users', getUsersList);
router.get('/stores', getStoresList);
router.get('/all-users', getAllUsersDetails);

module.exports = router;
