import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper className="glass-card" sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Admin Panel
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Admin features coming soon...
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AdminPanel;
