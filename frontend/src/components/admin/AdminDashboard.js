import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress
} from '@mui/material';
import {
  People,
  SupportAgent,
  AdminPanelSettings,
  Assignment,
  PriorityHigh,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="glass-card">
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h6" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h3" sx={{ mt: 1, fontWeight: 'bold' }}>
                {value}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

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

  return (
    <Grid container spacing={3}>
      {/* User Statistics */}
      <Grid item xs={12} md={3}>
        <StatCard
          title="Total Users"
          value={stats?.users?.total || 0}
          icon={<People />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Support Agents"
          value={stats?.users?.agents || 0}
          icon={<SupportAgent />}
          color="secondary"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="Admins"
          value={stats?.users?.admins || 0}
          icon={<AdminPanelSettings />}
          color="error"
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <StatCard
          title="End Users"
          value={stats?.users?.endUsers || 0}
          icon={<People />}
          color="info"
        />
      </Grid>

      {/* Ticket Statistics */}
      <Grid item xs={12} md={6}>
        <Card className="glass-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ticket Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="error.main">
                    {stats?.tickets?.open || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="warning.main">
                    {stats?.tickets?.inProgress || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="success.main">
                    {stats?.tickets?.resolved || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Resolved
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h4" color="text.secondary">
                    {stats?.tickets?.closed || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Closed
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Priority Breakdown */}
      <Grid item xs={12} md={6}>
        <Card className="glass-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Priority Breakdown
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={`Urgent: ${stats?.priority?.urgent || 0}`}
                color="error"
                variant="outlined"
              />
              <Chip
                label={`High: ${stats?.priority?.high || 0}`}
                color="warning"
                variant="outlined"
              />
              <Chip
                label={`Medium: ${stats?.priority?.medium || 0}`}
                color="info"
                variant="outlined"
              />
              <Chip
                label={`Low: ${stats?.priority?.low || 0}`}
                color="success"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity */}
      <Grid item xs={12}>
        <Card className="glass-card">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Ticket Activity
            </Typography>
            <List>
              {stats?.recentActivity?.slice(0, 8).map((ticket) => (
                <ListItem key={ticket.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(ticket.status) + '.main' }}>
                      <Assignment />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={ticket.subject}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip
                          label={ticket.status.replace('_', ' ')}
                          color={getStatusColor(ticket.status)}
                          size="small"
                        />
                        <Chip
                          label={ticket.priority}
                          color={getPriorityColor(ticket.priority)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          by {ticket.creator?.first_name} {ticket.creator?.last_name}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default AdminDashboard;
