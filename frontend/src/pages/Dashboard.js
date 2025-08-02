import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  Button 
} from '@mui/material';
import { 
  ConfirmationNumber,
  CheckCircle,
  Schedule,
  Error 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await ticketAPI.getTickets({ limit: 5 });
      const tickets = response.data.data.tickets;
      
      setRecentTickets(tickets);
      
      // Calculate stats
      const statsData = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
      };
      
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-card" sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box 
              sx={{ 
                p: 1, 
                borderRadius: 2, 
                bgcolor: `${color}.main`,
                color: 'white',
                mr: 2 
              }}
            >
              {icon}
            </Box>
            <Typography variant="h6">{title}</Typography>
          </Box>
          <Typography variant="h3" fontWeight="bold">
            {value}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.first_name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Here's what's happening with your tickets today.
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tickets"
              value={stats.total}
              icon={<ConfirmationNumber />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Open"
              value={stats.open}
              icon={<Error />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={<Schedule />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon={<CheckCircle />}
              color="success"
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Card className="glass-card" sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={() => navigate('/create-ticket')}
              >
                Create New Ticket
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/tickets')}
              >
                View All Tickets
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Tickets */}
        <Card className="glass-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Tickets
            </Typography>
            {recentTickets.length > 0 ? (
              <Box>
                {recentTickets.map((ticket) => (
                  <Box 
                    key={ticket.id}
                    sx={{ 
                      p: 2, 
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Typography variant="subtitle1">
                      {ticket.subject}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {ticket.status} • Priority: {ticket.priority}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">
                No tickets yet. Create your first ticket to get started!
              </Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
