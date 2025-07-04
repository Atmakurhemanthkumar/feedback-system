const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Feedback = require('../models/feedback');
const Form = require('../models/Form');
const User = require('../models/user');

// Submit feedback
router.post('/', auth, async (req, res) => {
  try {
    const { formId, responses } = req.body;
    
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ msg: 'Form not found' });
    console.log('Form ID:', formId);
    console.log('Responses:', responses);
    console.log('User ID from token:', req.user?.id);


    const feedback = new Feedback({
      formId,
      userId: req.user.id,
      responses
    });
    console.log("Incoming feedback submission:", {
  formId,
  userId: req.user.id,
  responses
});

    await feedback.save();
    console.log("Feedback saved successfully!");
    // Send notification (simplified)
    const user = await User.findById(req.user.id);
    sendNotification(user.email, 'Feedback submitted successfully');
    
     res.json({ msg: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('❌ Feedback submission failed:', err.message);
    res.status(500).send('Server error');
  }
});

// Get user's feedback history
router.get('/history', auth, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ userId: req.user.id }).populate('formId');
    res.json(feedbacks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

function sendNotification(email, message) {
  // In a real app, implement email or push notifications
  console.log(`Notification to ${email}: ${message}`);
}

module.exports = router;
