const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendBulkEmails, getHistory } = require('../controllers/emailController');

// Admin Login
router.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    return res.status(200).json({ message: 'Login successful', token: 'mock-jwt-token-any' });
  }
  
  return res.status(400).json({ error: 'Please provide both username and password' });
});

// Email Routes
router.post('/emails/send', sendBulkEmails);
router.get('/emails/history', getHistory);

module.exports = router;
