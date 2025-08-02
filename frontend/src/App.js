import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

// Components
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const queryClient = new QueryClient();

// Premium Dark Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#ec4899',
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#0f0f23',
      paper: '#1a1a2e',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      background: 'linear-gradient(45deg, #6366f1, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 32px',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(99, 102, 241, 0.35)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 26, 46, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&.Mui-focused': {
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 20px 0 rgba(99, 102, 241, 0.2)',
            },
          },
        },
      },
    },
  },
});

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
    },
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <div className="App">
              {/* Animated Background */}
              <div className="animated-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
              </div>

              <Navbar />
              
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/login" 
                    element={
                      <motion.div
                        key="login"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Login />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <motion.div
                        key="register"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <Register />
                      </motion.div>
                    } 
                  />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <motion.div
                          key="dashboard"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <Dashboard />
                        </motion.div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/tickets" 
                    element={
                      <ProtectedRoute>
                        <motion.div
                          key="tickets"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <TicketList />
                        </motion.div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* FIXED: Added missing ticket detail route */}
                  <Route 
                    path="/tickets/:id" 
                    element={
                      <ProtectedRoute>
                        <motion.div
                          key="ticket-detail"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <TicketDetail />
                        </motion.div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/create-ticket" 
                    element={
                      <ProtectedRoute>
                        <motion.div
                          key="create-ticket"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <CreateTicket />
                        </motion.div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <motion.div
                          key="profile"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <Profile />
                        </motion.div>
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute roles={['admin']}>
                        <motion.div
                          key="admin"
                          variants={pageVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <AdminPanel />
                        </motion.div>
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch all route for 404 */}
                  <Route 
                    path="*" 
                    element={
                      <motion.div
                        key="404"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          height: '50vh',
                          textAlign: 'center'
                        }}>
                          <h1>404 - Page Not Found</h1>
                          <p>The page you're looking for doesn't exist.</p>
                        </div>
                      </motion.div>
                    } 
                  />
                </Routes>
              </AnimatePresence>
              
              {/* Premium Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                  background: 'rgba(26, 26, 46, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
