const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken); // ← Fixed: use the actual function

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/', requireRole(['admin']), async (req, res) => {
  try {
    const { User } = require('../models');
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private/Admin
router.get('/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { User } = require('../models');
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PATCH /api/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.patch('/:id/role', requireRole(['admin']), async (req, res) => {
  try {
    const { User } = require('../models');
    const { role } = req.body;

    if (!['user', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ role });

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
