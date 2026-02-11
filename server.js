require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security headers
app.use(helmet());

// Enable CORS (có thể customize origin theo môi trường)
app.use(cors());

// Parse JSON request body
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api', routes);

// 404 + global error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

/**
 * Khởi động server theo thứ tự:
 * 1. Kết nối DB
 * 2. Listen port
 */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
