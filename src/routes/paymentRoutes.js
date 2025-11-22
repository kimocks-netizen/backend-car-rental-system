const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented in Module 4
router.post('/deposit', (req, res) => {
  res.json({ message: 'Pay booking deposit endpoint - coming soon' });
});

router.post('/rental', (req, res) => {
  res.json({ message: 'Pay rental amount endpoint - coming soon' });
});

router.post('/refund', (req, res) => {
  res.json({ message: 'Process refund endpoint - coming soon' });
});

router.get('/:bookingId', (req, res) => {
  res.json({ message: 'Get payment history endpoint - coming soon' });
});

module.exports = router;