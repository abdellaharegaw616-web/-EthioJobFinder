const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/job-alerts', require('./routes/jobAlertRoutes'));

// Health check / Root route
app.get('/', (req, res) => {
  res.json({ message: 'EthioJobFinder API is running', status: 'OK' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API is working', endpoints: ['/api/auth', '/api/jobs', '/api/applications', '/api/upload', '/api/admin', '/api/notifications', '/api/job-alerts'] });
});

// Error handler
app.use(errorHandler);

// MongoDB Connection
const DEFAULT_MONGO_URI = 'mongodb://abdellaj636_db_user:Abdellah12345@ac-smos3ib-shard-00-00.muytflx.mongodb.net:27017,ac-smos3ib-shard-00-01.muytflx.mongodb.net:27017,ac-smos3ib-shard-00-02.muytflx.mongodb.net:27017/ethiojobfinder?ssl=true&replicaSet=atlas-10yb8d-shard-0&authSource=admin';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('Continuing server without crashing...');
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
