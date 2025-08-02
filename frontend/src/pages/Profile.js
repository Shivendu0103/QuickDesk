import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper className="glass-card" sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            User Profile
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Name</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            
            <Typography variant="h6">Email</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user?.email}
            </Typography>
            
            <Typography variant="h6">Username</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {user?.username}
            </Typography>
            
            <Typography variant="h6">Role</Typography>
            <Typography variant="body1">
              {user?.role}
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Profile;

