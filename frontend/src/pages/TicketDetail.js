import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  Chip,
  Box,
  CircularProgress,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { ArrowBack, Edit, Save, Cancel } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ticketAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTicket, setUpdatedTicket] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await ticketAPI.getTicket(id);
      const ticketData = response.data.data;
      setTicket(ticketData);
      setUpdatedTicket({
        status: ticketData.status,
        priority: ticketData.priority
      });
    } catch (error) {
      console.error('Error fetching ticket:', error);
      setError(error.response?.data?.message || 'Failed to load ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    setUpdateLoading(true);
    try {
      // Update ticket status
      const response = await ticketAPI.updateTicketStatus(id, updatedTicket);
      
      // Update local state
      setTicket(response.data.data);
      setIsEditing(false);
      
      toast.success('Ticket updated successfully!');
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error(error.response?.data?.message || 'Failed to update ticket');
    } finally {
      setUpdateLoading(false);
    }
  };

  const canUpdateTicket = () => {
    if (!user || !ticket) return false;
    
    // Users can update their own tickets
    if (user.role === 'user' && ticket.user_id === user.id) return true;
    
    // Agents and admins can update any ticket
    if (user.role === 'agent' || user.role === 'admin') return true;
    
    return false;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getAvailableStatuses = () => {
    if (user?.role === 'user') {
      // Regular users can only close their tickets or reopen them
      return ['open', 'closed'];
    } else {
      // Agents and admins can use all statuses
      return ['open', 'in_progress', 'resolved', 'closed'];
    }
  };

  const getAvailablePriorities = () => {
    if (user?.role === 'user') {
      // Regular users might have limited priority options
      return ['low', 'medium', 'high', 'urgent'];
    } else {
      // Agents and admins can set any priority
      return ['low', 'medium', 'high', 'urgent'];
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/tickets')}
            startIcon={<ArrowBack />}
          >
            Back to Tickets
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!ticket) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6">Ticket not found</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/tickets')}
            startIcon={<ArrowBack />}
          >
            Back to Tickets
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/tickets')}
          >
            Back to Tickets
          </Button>
          
          {canUpdateTicket() && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isEditing ? (
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Ticket
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleUpdateTicket}
                    disabled={updateLoading}
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => {
                      setIsEditing(false);
                      setUpdatedTicket({
                        status: ticket.status,
                        priority: ticket.priority
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>

        <Paper className="glass-card" sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              {ticket.subject}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {!isEditing ? (
                <>
                  <Chip 
                    label={ticket.status?.replace('_', ' ')} 
                    color={getStatusColor(ticket.status)} 
                  />
                  <Chip 
                    label={ticket.priority} 
                    color={getPriorityColor(ticket.priority)} 
                  />
                  {ticket.category && (
                    <Chip label={ticket.category.name} variant="outlined" />
                  )}
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={updatedTicket.status}
                      onChange={(e) => setUpdatedTicket(prev => ({
                        ...prev,
                        status: e.target.value
                      }))}
                    >
                      {getAvailableStatuses().map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={updatedTicket.priority}
                      onChange={(e) => setUpdatedTicket(prev => ({
                        ...prev,
                        priority: e.target.value
                      }))}
                    >
                      {getAvailablePriorities().map((priority) => (
                        <MenuItem key={priority} value={priority}>
                          {priority}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Description:
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
            {ticket.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Created by:</strong>
              </Typography>
              <Typography variant="body1">
                {ticket.creator?.first_name} {ticket.creator?.last_name}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Created:</strong>
              </Typography>
              <Typography variant="body1">
                {new Date(ticket.created_at).toLocaleString()}
              </Typography>
            </Box>

            {ticket.assignee && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Assigned to:</strong>
                </Typography>
                <Typography variant="body1">
                  {ticket.assignee.first_name} {ticket.assignee.last_name}
                </Typography>
              </Box>
            )}

            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Ticket ID:</strong>
              </Typography>
              <Typography variant="body1">
                #{ticket.id}
              </Typography>
            </Box>
          </Box>

          {/* Comments section */}
          {ticket.comments && ticket.comments.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Comments:
              </Typography>
              <Box>
                {ticket.comments.map((comment) => (
                  <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {comment.author?.first_name} {comment.author?.last_name} - {new Date(comment.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {comment.content}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default TicketDetail;
