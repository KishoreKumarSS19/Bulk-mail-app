require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// MongoDB Connection
const { MongoMemoryServer } = require('mongodb-memory-server');

const PORT = process.env.PORT || 5000;
let MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    if (!MONGODB_URI || MONGODB_URI.includes('127.0.0.1')) {
      const mongoServer = await MongoMemoryServer.create();
      MONGODB_URI = mongoServer.getUri();
      console.log('Using in-memory MongoDB instance');
    }

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

startServer();
