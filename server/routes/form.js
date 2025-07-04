const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Form = require('../models/Form');

// @route   POST api/forms
// @desc    Create a form
router.post('/', 
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('questions', 'Questions are required').isArray({ min: 1 })
    ]
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, questions } = req.body;

      const newForm = new Form({
        title,
        description,
        questions,
        createdBy: req.user.id
      });

      const form = await newForm.save();
      res.json(form);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/forms
// @desc    Get all active forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// ✅ GET form by ID (Add this!)
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ msg: 'Form not found' });
    }
    res.json(form);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
