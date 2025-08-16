const express        = require('express');
const cors           = require('cors');
const helmet         = require('helmet');
const compression    = require('compression');
const rateLimit      = require('express-rate-limit');
const morgan         = require('morgan');
const http           = require('http');
const socketIo       = require('socket.io');
require('dotenv').config();

const { sequelize }  = require('./config/database');
const authRoutes     = require('./routes/auth');
const ticketRoutes   = require('./routes/tickets');
const userRoutes     = require('./routes/users');
const { setupSocket } = require('./services/socketService');

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

/* ───────────────  GLOBAL MIDDLEWARES  ─────────────── */
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

/* ───────────────  RATE-LIMITING  ─────────────── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1_000, // 15 min
  max: 100
});
app.use('/api/', limiter);

/* ───────────────  LOGGING (DEV ONLY)  ─────────────── */
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

/* ───────────────  SOCKET.IO  ─────────────── */
setupSocket(io);

/* ───────────────  ROUTES  ─────────────── */
app.use('/api/auth',    authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/users',   userRoutes);

/* Health-check */
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/* ───────────────  EMAIL TEST ROUTES  ─────────────── */
/* 1️⃣ Quick verification using emailService.testEmailConnection */
app.get('/test-email', async (req, res) => {
  const { testEmailConnection } = require('./services/emailService');
  const success = await testEmailConnection();
  res.json({ emailWorking: success });
});

/* 2️⃣ Full SMTP + send-mail test */
app.get('/test-email-simple', async (req, res) => {
  try {
    console.log('🔍 Testing email with environment variables:');
    console.log('EMAIL_USER:',     process.env.EMAIL_USER);
    console.log('EMAIL_HOST:',     process.env.EMAIL_HOST);
    console.log('EMAIL_PORT:',     process.env.EMAIL_PORT);
    console.log('EMAIL_PASSWORD set:', !!process.env.EMAIL_PASSWORD);

    const nodemailer  = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.verify();
    console.log('✅ SMTP connection verified');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to:   'shivendu0103@gmail.com',   // <-- change to any test inbox
      subject: 'QuickDesk Test Email',
      html: '<h1>Test Email Works!</h1><p>If you received this, email is configured correctly.</p>'
    });

    console.log('✅ Test email sent:', info.messageId);
    res.json({ success: true, messageId: info.messageId });

  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      error:   error.message,
      code:    error.code
    });
  }
});
/* ─────────────────────────────────────────────────── */

/* ───────────────  ERROR HANDLER  ─────────────── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error:   process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

/* ───────────────  404 HANDLER  ─────────────── */
/*  KEEP THIS LAST so earlier routes are reachable  */
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

/* ───────────────  START SERVER  ─────────────── */
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await sequelize.sync();
    console.log('Database models synchronized');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error);
    process.exit(1);
  }
})();

module.exports = { app, io };



// Add this line with your other route imports
const adminRoutes = require('./routes/admin');

// Add this line with your other route definitions
app.use('/api/admin', adminRoutes);
