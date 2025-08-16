import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  People,
  SupportAgent,
  AdminPanelSettings,
  Assignment,
  Edit,
  Delete,
  Search
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, user: null });

  // Redirect non-admins
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    fetchDashboardData();
    if (currentTab === 1) {
      fetchUsers();
    }
  }, [currentTab]);

  const fetchDashboardData = async () => {
    try {
      // Mock API call - replace with your actual API
      const mockStats = {
        users: {
          total: 150,
          agents: 12,
          admins: 3,
          endUsers: 135
        },
        tickets: {
          total: 485,
          open: 45,
          inProgress: 23,
          resolved: 387,
          closed: 30
        },
        priority: {
          urgent: 8,
          high: 17,
          medium: 35,
          low: 25
        },
        recentActivity: [
          { id: 1, subject: 'Login Issue with New Account', status: 'open', priority: 'high', creator: { first_name: 'John', last_name: 'Doe' } },
          { id: 2, subject: 'Email Notification Not Working', status: 'in_progress', priority: 'medium', creator: { first_name: 'Jane', last_name: 'Smith' } },
          { id: 3, subject: 'Password Reset Request', status: 'resolved', priority: 'low', creator: { first_name: 'Mike', last_name: 'Johnson' } }
        ]
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      // Mock users data - replace with your actual API
      const mockUsers = [
        { id: 1, username: 'shivendu0103', email: 'shivendu0103@gmail.com', first_name: 'Shivendu', last_name: 'Sinha', role: 'user', is_active: true, created_at: '2025-01-15' },
        { id: 2, username: 'agent1', email: 'agent@quickdesk.com', first_name: 'Support', last_name: 'Agent', role: 'agent', is_active: true, created_at: '2025-01-10' },
        { id: 5, username: 'admin1', email: 'admin@quickdesk.com', first_name: 'System', last_name: 'Admin', role: 'admin', is_active: true, created_at: '2025-01-01' },
        { id: 3, username: 'random', email: 'random123@gmail.com', first_name: 'Random', last_name: 'User', role: 'user', is_active: true, created_at: '2025-01-20' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      // Mock API call - replace with your actual API
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      // Mock API call - replace with your actual API
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
      toast.success('User status updated successfully');
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

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

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'agent': return 'secondary';
      case 'user': return 'primary';
      default: return 'default';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const DashboardTab = () => (
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
              {stats?.recentActivity?.map((ticket) => (
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

  const UserManagementTab = () => (
    <Card className="glass-card">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">User Management</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search users..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                label="Role"
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="user">End User</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((userData) => (
                  <TableRow key={userData.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar>{userData.first_name?.[0]}{userData.last_name?.[0]}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {userData.first_name} {userData.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @{userData.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={userData.role}
                          onChange={(e) => handleRoleChange(userData.id, e.target.value)}
                          disabled={userData.id === user.id} // Can't change own role
                        >
                          <MenuItem value="user">End User</MenuItem>
                          <MenuItem value="agent">Agent</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={userData.is_active ? 'Active' : 'Inactive'}
                        color={userData.is_active ? 'success' : 'default'}
                        size="small"
                        onClick={() => handleStatusToggle(userData.id, !userData.is_active)}
                        clickable
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(userData.created_at).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => setEditDialog({ open: true, user: userData })}
                        >
                          Edit
                        </Button>
                        {userData.id !== user.id && (
                          <Button
                            size="small"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this user?')) {
                                setUsers(users.filter(u => u.id !== userData.id));
                                toast.success('User deleted successfully');
                              }
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const AnalyticsTab = () => (
    <Card className="glass-card">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          System Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Advanced analytics and reporting features coming soon...
        </Typography>
      </CardContent>
    </Card>
  );

  const tabs = [
    { label: 'Dashboard', component: <DashboardTab /> },
    { label: 'User Management', component: <UserManagementTab /> },
    { label: 'Analytics', component: <AnalyticsTab /> }
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Manage users, monitor system performance, and configure settings
        </Typography>

        <Paper className="glass-card" sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {tabs[currentTab].component}
        </Box>

        {/* Edit User Dialog */}
        <Dialog
          open={editDialog.open}
          onClose={() => setEditDialog({ open: false, user: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="First Name"
              value={editDialog.user?.first_name || ''}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              value={editDialog.user?.last_name || ''}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={editDialog.user?.email || ''}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog({ open: false, user: null })}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => {
              setEditDialog({ open: false, user: null });
              toast.success('User updated successfully');
            }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
};

export default AdminPanel;
