const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in Module 3
router.get('/', (req, res) => {
  res.json({ message: 'Get all cars endpoint - coming soon' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get single car endpoint - coming soon' });
});

router.get('/availability', (req, res) => {
  res.json({ message: 'Check car availability endpoint - coming soon' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Add new car endpoint - coming soon' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update car endpoint - coming soon' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete car endpoint - coming soon' });
});

module.exports = router;