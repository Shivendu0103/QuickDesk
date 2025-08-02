const { body, validationResult, query } = require('express-validator');
const { Ticket, User, Category, Comment } = require('../models');
const { Op } = require('sequelize');
const { sendTicketNotification } = require('../services/emailService');
const { emitTicketUpdate } = require('../services/socketService');

// Get all tickets with filtering and pagination
const getTickets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      myTickets = false
    } = req.query;

    const offset = (page - 1) * limit;
    const where = {};

    // Apply filters
    if (status) where.status = status;
    if (category) where.category_id = category;
    if (priority) where.priority = priority;
    if (myTickets === 'true') where.user_id = req.user.id;

    // Search functionality
    if (search) {
      where[Op.or] = [
        { subject: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // User role-based filtering
    if (req.user.role === 'user') {
      where.user_id = req.user.id; // Users can only see their tickets
    } else if (req.user.role === 'agent') {
      // Agents can see all tickets or assigned tickets
      if (req.query.assigned === 'true') {
        where.assigned_to = req.user.id;
      }
    }

    const tickets = await Ticket.findAndCountAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['first_name', 'last_name'] }],
          order: [['created_at', 'ASC']]
        }
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        tickets: tickets.rows,
        totalCount: tickets.count,
        currentPage: parseInt(page),
        totalPages: Math.ceil(tickets.count / limit),
        hasNextPage: page * limit < tickets.count,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        {
          model: Comment,
          as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['first_name', 'last_name', 'role'] }],
          order: [['created_at', 'ASC']]
        }
      ]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: ticket
    });

  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new ticket
const createTicket = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { subject, description, category_id, priority = 'medium' } = req.body;

    const ticket = await Ticket.create({
      subject,
      description,
      category_id: category_id || null,
      priority,
      user_id: req.user.id,
      status: 'open'
    });

    // Fetch created ticket with associations
    const createdTicket = await Ticket.findByPk(ticket.id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ]
    });

    // Send email notification to agents
    await sendTicketNotification(createdTicket, 'created');

    // Emit real-time update
    emitTicketUpdate('ticket_created', createdTicket);

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: createdTicket
    });

  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update ticket status
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update ticket
    await ticket.update({ status });

    // Fetch updated ticket with associations
    const updatedTicket = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'first_name', 'last_name', 'email'] },
        { model: User, as: 'assignee', attributes: ['id', 'first_name', 'last_name'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] }
      ]
    });

    // Send email notification
    await sendTicketNotification(updatedTicket, 'status_updated');

    // Emit real-time update
    emitTicketUpdate('ticket_updated', updatedTicket);

    res.json({
      success: true,
      message: 'Ticket status updated successfully',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Add comment to ticket
const addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { content, is_internal = false } = req.body;

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check permissions for commenting
    if (req.user.role === 'user' && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const comment = await Comment.create({
      ticket_id: id,
      user_id: req.user.id,
      content,
      is_internal: req.user.role !== 'user' ? is_internal : false
    });

    // Fetch comment with author info
    const createdComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'author', attributes: ['first_name', 'last_name', 'role'] }]
    });

    // Update ticket's updated_at timestamp
    await ticket.update({ updated_at: new Date() });

    // Send email notification
    await sendTicketNotification(ticket, 'comment_added', createdComment);

    // Emit real-time update
    emitTicketUpdate('comment_added', { ticketId: id, comment: createdComment });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: createdComment
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Vote on ticket (upvote/downvote)
const voteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { voteType } = req.body; // 'upvote' or 'downvote'

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Update vote counts
    if (voteType === 'upvote') {
      await ticket.increment('upvotes');
    } else if (voteType === 'downvote') {
      await ticket.increment('downvotes');
    }

    res.json({
      success: true,
      message: `Ticket ${voteType}d successfully`,
      data: {
        upvotes: ticket.upvotes + (voteType === 'upvote' ? 1 : 0),
        downvotes: ticket.downvotes + (voteType === 'downvote' ? 1 : 0)
      }
    });

  } catch (error) {
    console.error('Vote ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Validation rules
const createTicketValidation = [
  body('subject')
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('description')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level')
];

const addCommentValidation = [
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters')
];

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  addComment,
  voteTicket,
  createTicketValidation,
  addCommentValidation
};
