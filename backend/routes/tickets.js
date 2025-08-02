const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicketStatus,
  addComment,
  voteTicket,
  createTicketValidation,
  addCommentValidation
} = require('../controllers/ticketController');
const auth = require('../middleware/auth');
const { authorize } = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// @route   GET /api/tickets
// @desc    Get all tickets with filtering
// @access  Private
router.get('/', getTickets);

// @route   GET /api/tickets/:id
// @desc    Get single ticket by ID
// @access  Private
router.get('/:id', getTicketById);

// @route   POST /api/tickets
// @desc    Create new ticket
// @access  Private
router.post('/', createTicketValidation, createTicket);

// @route   PATCH /api/tickets/:id/status
// @desc    Update ticket status
// @access  Private (Agents and Admins can update any, Users can update their own)
router.patch('/:id/status', updateTicketStatus);

// @route   POST /api/tickets/:id/comments
// @desc    Add comment to ticket
// @access  Private
router.post('/:id/comments', addCommentValidation, addComment);

// @route   POST /api/tickets/:id/vote
// @desc    Vote on ticket (upvote/downvote)
// @access  Private
router.post('/:id/vote', voteTicket);

// @route   PATCH /api/tickets/:id/assign
// @desc    Assign ticket to agent
// @access  Private (Agents and Admins only)
router.patch('/:id/assign', authorize('agent', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { assigneeId } = req.body;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    await ticket.update({ assigned_to: assigneeId });
    
    res.json({ success: true, message: 'Ticket assigned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
