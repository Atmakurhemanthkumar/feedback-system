const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/feedback');
const Form = require('../models/Form');
const User = require('../models/user');

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }
  next();
};

// Get all feedback (admin)
router.get('/feedback', auth, adminAuth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('formId').populate('userId');
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update feedback status (admin)
router.put('/feedback/:id', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!feedback) return res.status(404).json({ msg: 'Feedback not found' });
    
    res.json(feedback);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get analytics
router.get('/analytics', auth, adminAuth, async (req, res) => {
  try {
    const formCount = await Form.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const userCount = await User.countDocuments();
    
    const feedbackByStatus = await Feedback.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      formCount,
      feedbackCount,
      userCount,
      feedbackByStatus
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
