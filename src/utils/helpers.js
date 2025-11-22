const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateTotalAmount = (dailyRate, startDate, endDate) => {
  const days = calculateDays(startDate, endDate);
  return days * dailyRate;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

const generateBookingNumber = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `BK${timestamp.slice(-6)}${random}`;
};

const generateTransactionId = (type) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${type}_${timestamp}_${random}`;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

const paginate = (page, limit) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    offset
  };
};

module.exports = {
  calculateDays,
  calculateTotalAmount,
  formatCurrency,
  generateBookingNumber,
  generateTransactionId,
  isValidEmail,
  isValidPhone,
  sanitizeInput,
  paginate
};