# Easy Shop - Full Stack MERN Ecommerce Application

A complete ecommerce solution built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring environment-based configuration, JWT authentication, and comprehensive admin dashboard.

## 🚀 Features

### Customer Features
- **User Authentication**: Register, Login, Forgot/Reset Password with JWT
- **Product Catalog**: Browse products with filters, search, and pagination
- **Product Details**: View detailed product info with star ratings and reviews
- **Shopping Cart**: Add, update, remove items with local storage persistence
- **Wishlist**: Save favorite products (requires login)
- **Checkout**: Complete order flow with shipping address
- **Order Management**: View order history and track order status
- **User Profile**: Manage account info and default shipping address

### Admin Features
- **Dashboard**: Overview of products, orders, revenue statistics
- **Product Management**: Add, edit, delete products with image upload
- **Category Management**: Create and manage product categories
- **Order Management**: View all orders, update order/payment status
- **Coupon Management**: Create discount codes (percentage or fixed amount)

### Technical Features
- **Environment-based Configuration**: Easy deployment across environments
- **JWT Authentication**: Secure token-based auth with HTTP-only support
- **Rate Limiting**: Protection against brute force attacks
- **File Upload**: Multer-based image upload with validation
- **API Error Handling**: Centralized error handling middleware
- **Responsive Design**: Bootstrap 5 based mobile-friendly UI

## 📁 Project Structure

```
Ecommerce/
├── Back-end/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── email.js           # Nodemailer configuration
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── userController.js
│   │   ├── wishlistController.js
│   │   └── couponController.js
│   ├── middleware/
│   │   ├── user.js            # JWT auth middleware
│   │   ├── admin.js           # Admin authorization
│   │   ├── errorHandler.js    # Error handling
│   │   └── upload.js          # File upload config
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── Wishlist.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── couponRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── sendEmail.js
│   ├── uploads/               # Uploaded images
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   ├── package.json
│   ├── seeder.js              # Database seeder
│   └── server.js              # Express app entry
│
└── Front-end/
    ├── src/
    │   ├── api/
    │   │   └── axios.js       # API client with interceptors
    │   ├── Admin/
    │   │   ├── Dashboard.jsx
    │   │   ├── AddProduct.jsx
    │   │   ├── AddCategory.jsx
    │   │   ├── ManageOrders.jsx
    │   │   └── ManageCoupons.jsx
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Card.jsx
    │   │   ├── CartDesign.jsx
    │   │   ├── StarRating.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── Loading.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   ├── CartCOntext.jsx
    │   │   └── WishlistContext.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Shop.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Orders.jsx
    │   │   ├── OrderDetail.jsx
    │   │   ├── OrderSuccess.jsx
    │   │   ├── Wishlist.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx
    │   │   └── NotFound.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env                   # Environment variables
    ├── .env.example           # Environment template
    └── package.json
```

## 🛠️ Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd Back-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLIENT_URL=http://localhost:5173
   ```

4. Seed the database (optional):
   ```bash
   npm run seed
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd Front-end
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_UPLOADS_URL=http://localhost:5000/uploads
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/pay` - Mark as paid (Admin)
- `PUT /api/orders/:id/deliver` - Mark as delivered (Admin)

### Coupons
- `GET /api/coupons` - Get all coupons (Admin)
- `POST /api/coupons` - Create coupon (Admin)
- `POST /api/coupons/validate` - Validate coupon
- `PUT /api/coupons/:id` - Update coupon (Admin)
- `DELETE /api/coupons/:id` - Delete coupon (Admin)

## 🔐 Default Admin Account
After running the seeder:
- Email: `admin@example.com`
- Password: `admin123`

## 📝 Environment Variables

### Backend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | JWT expiration time | 30d |
| EMAIL_HOST | SMTP host | smtp.gmail.com |
| EMAIL_PORT | SMTP port | 587 |
| EMAIL_USER | Email username | - |
| EMAIL_PASS | Email password/app password | - |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

### Frontend (.env)
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |
| VITE_UPLOADS_URL | Uploads URL | http://localhost:5000/uploads |

## 🚀 Deployment

### Backend (Render/Railway/VPS)
1. Set all environment variables
2. Update `CLIENT_URL` to your frontend domain
3. Deploy with `npm start`

### Frontend (Vercel/Netlify)
1. Set environment variables pointing to your backend
2. Build with `npm run build`
3. Deploy the `dist` folder

## 📜 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👨‍💻 Author

**Arjun Kanani**

---

Built with ❤️ using MERN Stack

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
