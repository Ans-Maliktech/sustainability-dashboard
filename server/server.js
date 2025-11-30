require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;


// ============ MIDDLEWARE ============
app.use(cors({
    origin: "*", // Allow ALL connections
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============ API ROUTES ============
app.use('/api', apiRoutes);

// ============ ROOT ROUTE ============
app.get('/', (req, res) => {
  res.json({
    message: 'Sustainability Dashboard API',
    version: '1.0.0',
    endpoints: {
      upload: 'POST /api/upload',
      uploadStats: 'GET /api/upload/stats',
      allData: 'GET /api/data',
      dataByCategory: 'GET /api/data/category/:category',
      aggregatedData: 'GET /api/data/aggregated',
      summary: 'GET /api/data/summary',
      trends: 'GET /api/data/trends',
      deleteAll: 'DELETE /api/data/all',
      health: 'GET /api/health'
    }
  });
});

// ============ ERROR HANDLING ============
// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// ============ DATABASE CONNECTION & SERVER START ============
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established successfully');

    // Sync models (create tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✓ Database models synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🚀 Sustainability Dashboard API Server Running');
      console.log('='.repeat(50));
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌐 Base URL: http://localhost:${PORT}`);
      console.log(`📤 Upload: http://localhost:${PORT}/api/upload`);
      console.log(`📊 Data: http://localhost:${PORT}/api/data`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50) + '\n');
    });

  } catch (error) {
    console.error('✗ Unable to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

startServer();