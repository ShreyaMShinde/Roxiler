const express = require('express');
const cors = require('cors');
const dbInit = require('./utils/dbInit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend connection
app.use(cors({
  origin: 'http://localhost:5173', // Vite default development port
  credentials: true,
}));

app.use(express.json());

// Load routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/owner', ownerRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Database initialization then start server
dbInit()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend API Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database. Server not started.', err);
    process.exit(1);
  });
