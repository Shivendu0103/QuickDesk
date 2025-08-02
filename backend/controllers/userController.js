const { User, Ticket } = require('../models');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Get all users (Admin only)
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        users: users.rows,
        totalCount: users.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(users.count / limit)
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(id);
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
      data: user.getSafeData()
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Users can only view their own profile, agents/admins can view any
    if (req.user.role === 'user' && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at'],
      include: [
        {
          model: Ticket,
          as: 'tickets',
          attributes: ['id', 'subject', 'status', 'priority', 'created_at']
        }
      ]
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
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
  getUserProfile
};
