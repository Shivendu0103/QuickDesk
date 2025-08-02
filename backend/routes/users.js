const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserRole,
  getUserProfile
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', authorize('admin'), getUsers);

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Private
router.get('/:id', getUserProfile);

// @route   PATCH /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.patch('/:id/role', authorize('admin'), updateUserRole);

module.exports = router;
