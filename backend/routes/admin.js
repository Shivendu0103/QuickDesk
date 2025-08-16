const express = require('express');
const router = express.Router();
const { User, Ticket, Category, Comment } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken, requireRole } = require('../middleware/auth');

// Middleware: Only admins can access these routes
router.use(authenticateToken);
router.use(requireRole(['admin']));

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.count();
    const agentCount = await User.count({ where: { role: 'agent' } });
    const adminCount = await User.count({ where: { role: 'admin' } });
    const userCount = await User.count({ where: { role: 'user' } });

    // Ticket statistics
    const totalTickets = await Ticket.count();
    const openTickets = await Ticket.count({ where: { status: 'open' } });
    const inProgressTickets = await Ticket.count({ where: { status: 'in_progress' } });
    const resolvedTickets = await Ticket.count({ where: { status: 'resolved' } });
    const closedTickets = await Ticket.count({ where: { status: 'closed' } });

    // Priority breakdown
    const urgentTickets = await Ticket.count({ where: { priority: 'urgent' } });
    const highTickets = await Ticket.count({ where: { priority: 'high' } });
    const mediumTickets = await Ticket.count({ where: { priority: 'medium' } });
    const lowTickets = await Ticket.count({ where: { priority: 'low' } });

    // Recent activity (last 10 tickets)
    const recentTickets = await Ticket.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      include: [
        { model: User, as: 'creator', attributes: ['first_name', 'last_name'] }
      ]
    });

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          agents: agentCount,
          admins: adminCount,
          endUsers: userCount
        },
        tickets: {
          total: totalTickets,
          open: openTickets,
          inProgress: inProgressTickets,
          resolved: resolvedTickets,
          closed: closedTickets
        },
        priority: {
          urgent: urgentTickets,
          high: highTickets,
          medium: mediumTickets,
          low: lowTickets
        },
        recentActivity: recentTickets
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all users with filtering
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { username: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset
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
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update user role
router.patch('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'agent', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

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
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Toggle user active status
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ is_active });

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow deleting yourself
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
