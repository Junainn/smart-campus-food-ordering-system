# CUET Campus Food Ordering System

A full-stack MERN application for CUET campus food ordering with separate dashboards for students and vendors.

## Features

### Student Features
- Browse available vendors and menus
- Add items to cart (single vendor per order)
- Place orders with transaction ID
- Track order status in real-time
- Submit reviews with sentiment analysis (Bangla/English)
- View vendor ratings and reviews

### Vendor Features
- Manage menu items with images
- Set daily availability schedule
- Accept/reject orders based on payment verification
- Update order status (Pending → Accepted → Processing → Ready)
- View customer reviews and sentiment summary

## Tech Stack

**Frontend:**
- React 18 with Vite
- Material-UI (MUI) for design
- React Router for navigation
- Axios for API calls
- Local storage for cart persistence

**Backend:**
- Node.js with Express (ES6 modules)
- MongoDB Atlas for database
- JWT for authentication
- Cloudinary for image storage
- Hugging Face for sentiment analysis
- Multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- Hugging Face API key

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
   - Set `MONGODB_URI` with your MongoDB Atlas connection string
   - Set `JWT_SECRET` to a strong random string
   - Add Cloudinary credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
   - Add Hugging Face API key (`HUGGINGFACE_API_KEY`)

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Configure `VITE_API_URL` in `.env` (default: `http://localhost:5000/api`)

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Project Structure

```
cuet-food-ordering/
├── backend/
│   ├── config/          # Configuration files (DB, Cloudinary)
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth and validation middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions (sentiment analysis)
│   ├── .env.example     # Environment variables template
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context (Auth, Cart)
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   ├── utils/       # Helper functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── .env.example     # Environment variables template
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/student/register` - Student registration
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/vendor/register` - Vendor registration
- `POST /api/auth/vendor/login` - Vendor login

### Student Routes
- `GET /api/student/vendors` - Get available vendors
- `GET /api/student/vendors/:id` - Get vendor details
- `GET /api/student/menu/:vendorId` - Get vendor menu
- `POST /api/student/orders` - Place order
- `GET /api/student/orders` - Get order history
- `PATCH /api/student/orders/:id/resubmit` - Retry transaction ID
- `DELETE /api/student/orders/:id` - Cancel order
- `PATCH /api/student/orders/:id/complete` - Mark as received
- `POST /api/student/reviews` - Submit review

### Vendor Routes
- `GET /api/vendor/menu` - Get vendor's menu items
- `POST /api/vendor/menu` - Add menu item
- `PATCH /api/vendor/menu/:id` - Update menu item
- `DELETE /api/vendor/menu/:id` - Delete menu item
- `PATCH /api/vendor/availability` - Update availability
- `GET /api/vendor/orders` - Get orders
- `PATCH /api/vendor/orders/:id/verify` - Accept/reject order
- `PATCH /api/vendor/orders/:id/status` - Update order status
- `GET /api/vendor/reviews` - Get vendor reviews

## User Roles

### Students
- Email format: `u[YYDDIII]@student.cuet.ac.bd`
  - YY: Admission year (21-25)
  - DD: Department code (01-13)
  - III: Student ID (001-999)

### Vendors
- Register with email and stall information
- Manage single food stall per account

## Order Status Flow

1. **Pending** - Order placed, awaiting vendor verification
2. **Rejected** - Payment verification failed (can retry)
3. **Accepted** - Payment verified by vendor
4. **Processing** - Order being prepared
5. **Ready** - Order ready for pickup
6. **Completed** - Student marked as received

## Payment Flow

1. Student places order and enters transaction ID
2. Vendor verifies transaction ID
3. If valid → Accept (continue to Processing)
4. If invalid → Reject with reason (student can retry once)

## Review System

1. Students can review after marking order as "Received"
2. Reviews include rating (1-5 stars) and comment (Bangla/English)
3. Sentiment analysis labels comments as Positive/Negative/Neutral
4. Vendor profile shows sentiment summary statistics

## Future Enhancements

- Real-time notifications with WebSocket
- Payment gateway integration
- Admin dashboard
- Vendor analytics
- Day-specific availability schedules
- Mobile app version

## License

ISC

## Contributors

CUET SWD Project Team
