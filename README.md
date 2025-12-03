# Car Rental System - Backend API

A comprehensive Node.js/Express backend API for a car rental management system with role-based authentication, booking management, and financial tracking.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Staff, Customer)
- Secure password hashing with bcrypt
- User profile management

### Car Management
- CRUD operations for car inventory
- Image upload to Supabase storage
- Availability tracking and management
- Multi-unit car support

### Booking System
- Complete booking lifecycle management
- Real-time availability checking
- Booking status tracking (pending, confirmed, active, returned, completed, cancelled)
- Conflict prevention for overlapping bookings

### Financial Management
- Customer balance tracking
- Security deposit system (30% of rental amount)
- Cancellation fee processing (20% charge)
- Damage assessment and billing
- Revenue tracking and analytics

### Staff Operations
- Return inspection system
- Damage assessment (0-10 scale)
- Car condition reporting
- Booking status management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT + Supabase Auth
- **File Storage**: Supabase Storage
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **CORS**: cors middleware

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend-car-rental-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key
   
   # Server Configuration
   PORT=8000
   
   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
   ```

4. **Database Setup**
   Run the SQL scripts in the `database-car-rental/` directory to set up your Supabase database tables.

5. **Start the server**
   ```bash
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone": "+1234567890"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/me
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "cust_address": "123 Main St",
  "license_number": "DL123456"
}
```

### Car Management Endpoints

#### Get Available Cars
```http
GET /cars/available
```

#### Get All Cars (Admin/Staff)
```http
GET /cars
Authorization: Bearer <jwt_token>
```

#### Create Car (Admin)
```http
POST /cars
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

{
  "brand": "Toyota",
  "model": "Camry",
  "year": 2023,
  "type": "sedan",
  "fuel_type": "petrol",
  "transmission": "automatic",
  "daily_rate": 50.00,
  "available_quantity": 3
}
```

### Booking Endpoints

#### Get My Bookings
```http
GET /bookings/my-bookings
Authorization: Bearer <jwt_token>
```

#### Create Booking
```http
POST /bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "car_id": "uuid",
  "start_date": "2024-01-15",
  "end_date": "2024-01-20",
  "total_amount": 250.00,
  "pickup_location": "Main Office",
  "dropoff_location": "Airport"
}
```

#### Update Booking Status (Staff/Admin)
```http
PATCH /bookings/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "confirmed"
}
```

### Financial Endpoints

#### Get Customer Balance
```http
GET /customer/balance
Authorization: Bearer <jwt_token>
```

#### Get Transaction History
```http
GET /customer/transactions
Authorization: Bearer <jwt_token>
```

## 🗂️ Project Structure

```
backend-car-rental-system/
├── src/
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── bookingController.js
│   │   └── ...
│   ├── middleware/           # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorHandler.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── carRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── ...
│   ├── services/            # Business logic
│   │   ├── bookingService.js
│   │   ├── balanceService.js
│   │   └── ...
│   ├── utils/               # Utilities
│   │   ├── database.js
│   │   ├── apiResponse.js
│   │   └── ...
│   └── app.js              # Express app setup
├── database-car-rental/     # SQL scripts
├── scripts/                # Utility scripts
└── package.json
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different permissions for Admin, Staff, and Customer roles
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **CORS Protection**: Configurable CORS origins
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Comprehensive error handling and logging

## 💰 Financial System

### Customer Balance
- Tracks customer account balance
- Handles deposits and charges
- Automatic deductions for bookings and fees

### Security Deposits
- 30% of rental amount held as security deposit
- Released upon successful return inspection
- Deducted for damage charges if applicable

### Fee Structure
- **Cancellation Fee**: 20% of booking amount
- **Damage Charges**: Variable based on assessment (0-10 scale)
- **Late Return**: Additional daily charges

## 📊 Booking Lifecycle

1. **Pending**: Initial booking created, awaiting confirmation
2. **Confirmed**: Booking approved, payment processed
3. **Active**: Customer has picked up the car
4. **Returned**: Car returned, awaiting inspection
5. **Completed**: Inspection complete, booking finalized
6. **Cancelled**: Booking cancelled (with applicable fees)

## 🚗 Car Management

### Availability System
- Real-time availability tracking
- Multi-unit support (1-5+ cars per model)
- Automatic availability updates based on bookings
- Conflict prevention for overlapping reservations

### Image Management
- Supabase storage integration
- Multiple image upload support
- Automatic image optimization
- Secure URL generation

## 🔧 Development

### Running in Development
```bash
npm run dev
```

### Environment Variables
Ensure all required environment variables are set in your `.env` file.

### Database Migrations
Run the SQL scripts in `database-car-rental/` directory in order:
1. `tables.sql` - Create main tables
2. `bookings.sql` - Booking system tables
3. `seed_data.sql` - Sample data (optional)

## 🚀 Deployment

### Railway Deployment
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
SUPABASE_URL=your_production_supabase_url
SUPABASE_KEY=your_production_supabase_key
JWT_SECRET=your_strong_jwt_secret
ALLOWED_ORIGINS=https://yourdomain.com
```

## 📝 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Email: admin@carrental.com
- Phone: +44 7469 46835

---

*Built with ❤️ for efficient car rental management*