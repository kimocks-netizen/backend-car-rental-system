const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
};

const USER_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  INACTIVE: 'inactive'
};

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const CAR_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  MAINTENANCE: 'maintenance'
};

const PAYMENT_TYPES = {
  DEPOSIT: 'deposit',
  RENTAL: 'rental',
  REFUND: 'refund'
};

const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const CAR_TYPES = {
  SEDAN: 'sedan',
  SUV: 'suv',
  HATCHBACK: 'hatchback',
  LUXURY: 'luxury',
  VAN: 'van'
};

const FUEL_TYPES = {
  PETROL: 'petrol',
  DIESEL: 'diesel',
  ELECTRIC: 'electric',
  HYBRID: 'hybrid'
};

const TRANSMISSION_TYPES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
};

module.exports = {
  USER_ROLES,
  USER_STATUS,
  BOOKING_STATUS,
  CAR_STATUS,
  PAYMENT_TYPES,
  PAYMENT_STATUS,
  CAR_TYPES,
  FUEL_TYPES,
  TRANSMISSION_TYPES
};